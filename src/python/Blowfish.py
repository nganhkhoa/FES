from Crypto import Random
from Crypto.Cipher import Blowfish

import os
import gevent


class BlowfishCipher:

    def __add_pad(self, chunk):
        """ Return a chunk with padding added (ISO 10126). """
        bs = Blowfish.block_size
        padding = bs - (len(chunk) % bs)
        for idx, i in enumerate(range(padding), start=1):
            chunk += os.urandom(1) if idx != padding else str(padding).encode()
        return chunk

    def __del_pad(self, chunk):
        """ Return a chunk with padding removed (ISO 10126). """
        return chunk[:-int(chunk[-1:])]

    def generate_key(self, passphrase):
        return [passphrase]

    def encrypt(self, originalFile, key, output):
        infile = open(originalFile, 'rb')
        outfile = open(output, 'wb')
        if (os.path.isfile(key)):
            key = open(key).read()
        else:
            pass

        chunk_size = 720
        iv = Random.new().read(Blowfish.block_size)
        cipher = Blowfish.new(key, Blowfish.MODE_CBC, iv)

        chunk = infile.read(chunk_size)
        if len(chunk) != chunk_size:
            encode = iv + cipher.encrypt(self.__add_pad(chunk))
        else:
            encode = iv + cipher.encrypt(chunk)
        outfile.write(encode)

        num_block = os.path.getsize(originalFile) // chunk_size
        round = 0

        while True:
            chunk = infile.read(chunk_size)
            if not chunk:
                break
            elif len(chunk) != chunk_size:
                encode = cipher.encrypt(self.__add_pad(chunk))
            else:
                encode = cipher.encrypt(chunk)
            outfile.write(encode)
            yield "{}/{}".format(round, num_block)
            round += 1

        infile.close()
        outfile.close()

    def decrypt(self, encryptedFile, key, output):
        """ Return a decrypted chunk. """
        chunk_size = 720
        bs = Blowfish.block_size
        if (os.path.isfile(key)):
            key = open(key).read()
        else:
            pass

        ifile = open(encryptedFile, 'rb')
        ofile = open(output, 'wb')

        iv = ifile.read(bs)
        cipher = Blowfish.new(key, Blowfish.MODE_CBC, iv)

        num_block = os.path.getsize(encryptedFile) // chunk_size
        round = 0

        while True:
            chunk = ifile.read(chunk_size)
            encode = ''
            if not chunk:
                break
            elif len(chunk) != chunk_size:
                encode = self.__del_pad(cipher.decrypt(chunk))
            else:
                encode = cipher.decrypt(chunk)
            ofile.write(encode)
            yield "{}/{}".format(round, num_block)
            round += 1

        ifile.close()
        ofile.close()
