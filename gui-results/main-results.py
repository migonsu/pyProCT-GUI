'''
Created on 02/05/2013

@author: victor
'''

import SimpleHTTPServer
import SocketServer
import webbrowser
import json
import os

if __name__ == '__main__':
    
    executor = None
    ongoing_clustering = False
    
    class ServerHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):
        """
        Very simple implementation of a Request handler which only accepts POST requests.
        """
        
        def get_handlers(self):
            return {
                    "/run": None,
            }
        
        
        
        def do_POST(self):
            fp= self.rfile
            data = fp.read(int(self.headers['Content-Length']))
            handle = self.get_handlers()[self.path]
            print "PATH", self.path
            handle(data)
            
    os.system("pwd")
    os.chdir("./static") 
    IP = "127.0.0.1"
    PORT = 8001
    Handler = ServerHandler
    SocketServer.TCPServer.allow_reuse_address = True
    httpd = SocketServer.TCPServer((IP, PORT), Handler)
    webbrowser.open("http://"+IP+":"+str(PORT)+"/results.html", new = 0, autoraise=True)
    print "Serving at port", PORT
    httpd.serve_forever()
