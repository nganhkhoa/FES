import zerorpc
import shutil
import os
import gevent
import signal

from gevent import monkey

from RSA import RSACipher
from AES import AESCipher
from Blowfish import BlowfishCipher

from RPCError import InvalidAlgorithm


def algorithmFactory(algo):
    if algo == 'RSA':
        return RSACipher()
    elif algo == 'AES':
        return AESCipher()
    elif algo == 'Blowfish':
        return BlowfishCipher()
    else:
        raise InvalidAlgorithm(algo, "Unsupported algorithm")


class RPC(object):
    def generate_key(self, algo, passphrase=None):
        print("Generate key {} with {}".format(algo, passphrase))
        algoInstance = algorithmFactory(algo)
        return algoInstance.generate_key(passphrase)

    @zerorpc.stream
    def encrypt(self, algo, file, keyfile):
        first_res = "Encrypt {} using {} with {}".format(file, algo, keyfile)
        print(first_res)
        yield first_res
        algoInstance = algorithmFactory(algo)

        folder = None
        outfile = file + '_encrypted'
        if (os.path.isdir(file)):
            folder = file
            print("Encrypt folder {} using {}".format(folder, algo))
            archive = shutil.make_archive(folder, 'zip', folder)
            print("Created zip file of folder")
            file = archive
        for percentage in algoInstance.encrypt(
                file, keyfile, outfile):
            # yield percentage
            gevent.sleep(0)
        if (folder is not None):
            os.remove(archive)
        msg = "Encrypted:{}:{}:{}:{}".format(file, algo, keyfile, outfile)
        print(msg)
        yield msg

    @zerorpc.stream
    def decrypt(self, algo, file, keyfile):
        first_res = "Decrypt {} using {} with {}".format(file, algo, keyfile)
        print(first_res)
        yield first_res
        algoInstance = algorithmFactory(algo)

        outfile = file + '_decrypted'
        if (not os.path.isfile(file)):
            raise InvalidAlgorithm(algo, "File is not found")
        for percentage in algoInstance.decrypt(
                file, keyfile, outfile):
            # yield percentage
            gevent.sleep(0)
        msg = "Decrypted:{}:{}:{}:{}".format(file, algo, keyfile, outfile)
        print(msg)
        yield msg


INTERRUPTS = 0


def build_handler(server):
    def handler(signum=-1, frame=None):
        global INTERRUPTS
        INTERRUPTS += 1
        print(
            'Signal handler called with signal %s for the %s time' %
            (signum, INTERRUPTS))
        if INTERRUPTS > 2:
            print("Raising due to repeat interrupts")
            raise KeyboardInterrupt
        server.close()
    return handler


monkey.patch_all()
s = zerorpc.Server(RPC(), pool_size=5)
s.bind("tcp://0.0.0.0:4242")
print("Server running on port 4242")
gevent.signal(signal.SIGINT, build_handler(s))
s.run()
