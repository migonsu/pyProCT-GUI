'''
Created on 08/05/2013

@author: victor
'''
import threading
import traceback
from pyproclust.driver.driver import Driver
from gui.exceptionThread import ThreadWithExc

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
