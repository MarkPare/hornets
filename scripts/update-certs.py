import json
import subprocess
import sys

def call_shell(command):
  subprocess.check_call(command, shell=True, stderr=subprocess.STDOUT)

def main():
  '''
  Updates certs across namespaces. Namespaces should be
  comma-separated list, no spaces
  Example:
  > secretName=my-secret
  > cert=/local/path/to/certs/fullchain.pem
  > key=/local/path/to/certs/privkey.pem.pem
  > namespaces=default
  > python update-certs.py $cert $key $namespaces
  '''
  secretName = sys.argv[1]
  certFilePath = sys.argv[2]
  keyFilePath = sys.argv[3]
  namespacesString = sys.argv[4]

  namespaces = [ n.strip() for n in namespacesString.split(',') ]

  for namespace in namespaces:
    command = 'kubectl create secret tls {} --cert={} --key={} --dry-run -o yaml | kubectl apply -n {} -f -'.format(secretName, certFilePath, keyFilePath, namespace)
    call_shell(command)

if __name__ == '__main__':
  main()
