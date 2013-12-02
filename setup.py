'''
Created on 29/11/2013

@author: victor
'''
from distutils.core import setup
import os

def read(fname):
    return open(os.path.join(os.path.dirname(__file__), fname)).read()

setup(
    name='pyProCT-GUI',
    version='0.1.0',
    description='A Graphical User Interface for pyProCT clustering toolkit.',
    author='Victor Alejandro Gil Sepulveda',
    author_email='victor.gil.sepulveda@gmail.com',
    url='https://github.com/victor-gil-sepulveda/pyProCT-GUI.git',
    packages=[
              'pyproctgui',
              'pyproctgui.gui'
    ],
    license = 'LICENSE.txt',
    long_description = read('README.rst'),
    #dependencies (pyproct, prody, )
    #entrypoints for script
    install_requires=[
        "pyProCT>=1.0.0"
      ],
)
