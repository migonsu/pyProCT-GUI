'''
Created on 21/01/2013

@author: victor
'''

import SimpleHTTPServer
import SocketServer
import webbrowser
import json
import hashlib
import time
import os.path
from pyproclust.tools.commonTools import convert_to_utf8
from pyproclust.tools.scriptTools import create_directory
import urllib
import prody
import urllib2
from pyproclust.driver.driver import Driver
from pyproclust.driver.parameters import ProtocolParameters
from pyproclust.driver.observer.observer import Observer
import threading
from gui.exceptionThread import ThreadWithExc
import traceback



def browsing_connector(root_folder):
    print root_folder
    root_folder = root_folder.replace("%2F","/")
    r=['<ul class="jqueryFileTree" style="display: none;">']
    r.append('<li class="directory collapsed"><a href="#" rel="%s/..">..</a></li>'%root_folder)
    try:
        d=urllib.unquote(root_folder)
        for f in os.listdir(d):
            ff=os.path.join(d,f)
            if os.path.isdir(ff):
                r.append('<li class="directory collapsed"><a href="#" rel="%s/">%s</a></li>' % (ff,f))
            else:
                e=os.path.splitext(f)[1][1:] # get .ext and remove dot
                r.append('<li class="file ext_%s"><a href="#" rel="%s">%s</a></li>' % (e,ff,f))
        r.append('</ul>')
    except Exception,e:
        r.append('Could not load directory: %s' % str(e))
    r.append('</ul>')
    return ''.join(r)

def get_pdb_selection(data):
    pdb_file = data['pdb']
    selection_string = data['selection']
    base_workspace = data['base']
    
    if selection_string == "":
        return "EMPTY"
    
    # First extract the first frame
    pdb_file_handler = open(pdb_file,"r")
    
    for line in pdb_file_handler:
        if line[0:5] == "MODEL":
            break
        
    first_frame_lines = line
    for line in pdb_file_handler:
        if line[0:5] == "MODEL":
            break
        else:
            first_frame_lines += line
    
    first_frame_lines += "ENDMDL\n"
    pdb_file_handler.close()
    open(os.path.join(base_workspace,"tmp_pdb_first_frame"),"w").write(first_frame_lines)
    
    selection = None
    try:
        selection = prody.parsePDB(os.path.join(base_workspace,"tmp_pdb_first_frame")).select(selection_string)
    except prody.SelectionError:
        return "ERROR:MalformedSelection"
    except AttributeError:
        return "ERROR:MalformedSelection"
    
    if selection == None or len(selection.getCoordsets()) == 0:
        return "ERROR:ImproductiveSelection"
    
    selection_coordsets = selection.getCoordsets()[0]
    number_of_atoms = len(selection_coordsets)
    atom_elements = selection.getElements()

    lines = ["%d\n"%(number_of_atoms),"%s first frame\n"%(pdb_file)]
    for i in range(number_of_atoms):
        initial_string = "  %s"%atom_elements[i]
        coord_triplet = selection_coordsets[i]
        for coord in coord_triplet:
            initial_string+=("%10.5f"%coord).rjust(15)
        lines.append(initial_string+"\n")
    return urllib2.quote("".join(lines))

def undefined_action(status, action, value):
    status["status"] = action
    status["value"] = False

def cluster_search_action(status, action, value):
    probe = ""
    if len(value["Idle"]) != 0:
        probe = value["Idle"][0]
    
    if len(value["Running"]) != 0:
        probe = value["Running"][0]
    
    if len(value["Ended"]) != 0:
        probe = value["Ended"][0]
    
    if "Evaluation" in probe:
        status["status"] = action[1]
    else:
        status["status"] = action[0]
        
    total = len(value["Ended"])+len(value["Idle"])+len(value["Running"])
    status["value"] = (len(value["Ended"]) / float(total))*100

class StatusListener(threading.Thread):
    
    def __init__(self,data_source, status):
        super(StatusListener, self).__init__()
        self._stop = threading.Event()
        self.data_source = data_source
        self.status = status
        
    def stop(self):
        self._stop.set()
        self.data_source.notify("Main","Stop","Finished")

    def stopped(self):
        return self._stop.isSet()
    
    def run(self):
        global ongoing_clustering
        observable_actions = {
                              "Matrix calculation": {"label": "Initializing (Matrix Calculation) ...",
                                                     "function":undefined_action},
                              "Process List":{"label": ["Performing clustering exploration...",
                                                        "Evaluating ..."],
                                              "function": cluster_search_action},
                              
                              }
        while not self.stopped():
            self.data_source.data_change_event.wait()
            print self.data_source.data
            action = self.data_source.data.contents["action"]
            value = self.data_source.data.contents["message"]
            if action in observable_actions:
                observable_actions[action]["function"](self.status, observable_actions[action]["label"], value)
            self.data_source.data_change_event.clear()
            if self.data_source.data.contents["action"] == "SHUTDOWN":
                break
        self.status["status"] = "Ended"
        print "statusListener ended"
        
class ExecutionThread(ThreadWithExc):
    def __init__(self, observer, parameters):
        super(ExecutionThread, self).__init__()
        self.observer = observer
        self.parameters = parameters
        self.status = {"status":"Initializing...","value":False}
        self.driver = None
        self.driver_process = None
        
    def run(self):
        global ongoing_clustering
        ongoing_clustering = True
        self.status_listener = StatusListener(self.observer, self.status)
        self.status_listener.start()
        try:
            self.driver = Driver(self.observer)
            self.driver.run(self.parameters)
        except Exception, e:
            print e
            print traceback.format_exc()
        finally:
            self.status_listener.stop()
            self.observer.notify("ExecutionThread","SHUTDOWN","Driver ended.")
            ongoing_clustering = False
            print "Exethread ended"
        
if __name__ == '__main__':
    
    executor = None
    ongoing_clustering = False
    
    class ServerHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):
        """
        Very simple implementation of a Request handler which only accepts POST requests.
        """
        
        def get_handlers(self):
            return {
                    "/run": self.run_handler,
                    "/run_update_status": self.run_update_status,
                    "/save_params": self.save_params_handler,
                    "/file_exists": self.file_exists_handler,
                    "/create_directory": self.create_directory,
                    "/browse_folder":self.browse_folder,
                    "/do_selection":self.do_selection,
                    "/stop_calculations":self.stop_calculations
            }
        
        def do_selection(self,data):
            data = convert_to_utf8(json.loads(data))
            print data
            self.wfile.write(get_pdb_selection(data))

        def browse_folder(self, data):
            chunks = data.split("=")
            print "Browsing", chunks[1]
            print browsing_connector(chunks[1])
            self.wfile.write(browsing_connector(chunks[1]))
        
        def file_exists_handler(self, data):
            data = convert_to_utf8(json.loads(data))
            print data
            self.wfile.write(json.dumps({"exists":os.path.exists(data['location']),
                                         "isfile":os.path.isfile(data['location']),
                                         "isdir":os.path.isdir(data['location'])}))
        
        def create_directory(self,data):
            data = convert_to_utf8(json.loads(data))
            print data
            try:
                success = create_directory(data['location'], ensure_writability = True)
                self.wfile.write(json.dumps({"done":success}))
            except:
                self.wfile.write(json.dumps({"done":False}))
           
        def run_handler(self, data):
            json_script = convert_to_utf8(json.loads(data))
            print json_script
            parameters = None
            try:
                parameters = ProtocolParameters(json_script)
            except ValueError:
                self.wfile.write(json.dumps({"exit_status":"Malformed json script."}))
            
            observer = Observer()
            
            global executor 
            global ongoing_clustering
            
            if ongoing_clustering == False:
                executor = ExecutionThread(observer, parameters)
                executor.start()
                self.wfile.write("OK")
            else:
                self.wfile.write("KO")
            
        def run_update_status(self, data):
            global executor
            self.wfile.write(json.dumps(executor.status))
        
        def stop_calculations(self, data):
            global executor 
            global ongoing_clustering
            if ongoing_clustering == True:
                executor.raiseExc(Exception)
                time.sleep(5)
                if executor.is_alive():
                    self.wfile.write('KO')
                else:
                    self.wfile.write('OK')

        def save_params_handler(self, data):
            data = convert_to_utf8(json.loads(data))
            print data
            create_directory("scripts")
            my_hash = hashlib.sha1()
            my_hash.update(str(time.time()))
            path = "scripts/"+my_hash.hexdigest()[:10]+".ppc"
            script_handler = open(path,"w")
            script_handler.write(json.dumps(data, sort_keys=False, indent=4, separators=(',', ': ')))
            script_handler.close()
            self.wfile.write('{"file_url":"'+path+'"}')
        
        def do_POST(self):
            fp= self.rfile
            data = fp.read(int(self.headers['Content-Length']))
            handle = self.get_handlers()[self.path]
            print "PATH", self.path
            handle(data)
            
    os.system("pwd")
    os.chdir("./static") 
    IP = "127.0.0.1"
    PORT = 8000
    Handler = ServerHandler
    SocketServer.TCPServer.allow_reuse_address = True
    httpd = SocketServer.TCPServer((IP, PORT), Handler)
    webbrowser.open("http://"+IP+":"+str(PORT), new = 0, autoraise=True)
    print "Serving at port", PORT
    httpd.serve_forever()
