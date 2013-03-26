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
import os
from pyproclust.tools.commonTools import convert_to_utf8
from pyproclust.tools.scriptTools import create_directory
import urllib

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

if __name__ == '__main__':
    
    class ServerHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):
        """
        Very simple implementation of a Request handler which only accepts POST requests.
        """
        
        def get_handlers(self):
            return {
                    "/run": self.run_handler,
                    "/save_params": self.save_params_handler,
                    "/file_exists": self.file_exists_handler,
                    "/create_directory": self.create_directory,
                    "/browse_folder":self.browse_folder
            }
        
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
#            parameters = ProtocolParameters.get_params_from_json(data)#
#            print parameters
#            protocol = Protocol()
#            protocol.run(parameters)
            pass
        
        def save_params_handler(self, data):
            pass
            data = convert_to_utf8(json.loads(data))
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
    PORT = 8000
    Handler = ServerHandler
    SocketServer.TCPServer.allow_reuse_address = True
    httpd = SocketServer.TCPServer(("localhost", PORT), Handler)
    webbrowser.open("http://127.0.0.1:8000", new=0, autoraise=True)
    print "Serving at port", PORT
    httpd.serve_forever()