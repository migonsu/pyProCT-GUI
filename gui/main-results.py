'''
Created on 02/05/2013

@author: victor
'''

import SimpleHTTPServer
import SocketServer
import webbrowser
import json
import os
from pyproclust.tools.commonTools import convert_to_utf8
from pyproclust.tools.scriptTools import create_directory
import shutil
import urlparse

if __name__ == '__main__':
    
    executor = None
    ongoing_clustering = False
    
    class ServerHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):
        """
        Very simple implementation of a Request handler which only accepts POST requests.
        """
        
        def post_handlers(self):
            return {
            }
        
        def get_handlers(self):
            return {
                    "/serve_file": self.serve_file_handler,
            }
        
        def serve_file_handler(self, query):
            filename = os.path.basename(query[path])
            self.send_response(200)
            self.send_header('Content-type', "application/octet-stream")
            self.send_header('Cache-Control', "private")
            self.send_header('Content-Length', "%d"%os.path.getsize(path))
            self.send_header('Content-Disposition', "attachment; filename=%s"%filename)
            self.end_headers()
            lines = open(path,"r").readlines()
            for l in lines:
                print l
                self.wfile.write(l)
            
        def do_POST(self):
            fp= self.rfile
            data = fp.read(int(self.headers['Content-Length']))
            handle = self.post_handlers()[self.path]
            print "PATH", self.path
            handle(data)
            
        def do_GET(self):
            parsedParams = urlparse.urlparse(self.path)
            query = urlparse.parse_qs(parsedParams.query)
            if parsedParams.path in self.get_handlers().keys():
                handler = self.get_handlers()[parsedParams.path];
                handler(query)
            else:
              SimpleHTTPServer.SimpleHTTPRequestHandler.do_GET(self);
              
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
