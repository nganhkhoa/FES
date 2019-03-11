import zerorpc
import glob
import time

class RPC(object):
    @zerorpc.stream
    def encrypt_folder(self, algo, folder):
        for file in glob.iglob(folder, recursive=True):
            yield self.encrypt_file(algo, file)

    def encrypt_file(self, algo, file):
        i = 0
        while i < 1000000:
            # do something
            i += 1
            pass
        return file

s = zerorpc.Server(RPC())
s.bind("tcp://0.0.0.0:4242")
s.run()
