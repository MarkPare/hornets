import json
import subprocess
import sys
import shutil
import os

KEEP_PATH = 'keep'

# Convenience function for passing
# same params to check_call
def call_shell(command):
  subprocess.check_call(command, shell=True, stderr=subprocess.STDOUT)

def process_dir(path, whitelist):
    files = os.listdir(path)
    for file_name in files:
        if file_name in whitelist:
            full_path = os.path.join(path, file_name)
            next_path = os.path.join(os.getcwd(), KEEP_PATH, file_name)
            shutil.copyfile(full_path, next_path)

def main():
    '''
    Filters images using whitelist
    '''
    folder_path = '../web/src/image-data'
    whitelist_file_path = './metadata/hornets-data.json'
    whitelist_file_path_prev = os.path.expanduser('~/Downloads/hornets-data.json')
    
    sub_paths = os.listdir(folder_path)
    if os.path.exists(KEEP_PATH):
        shutil.rmtree(KEEP_PATH)
    os.mkdir(KEEP_PATH)

    if not os.path.exists(whitelist_file_path):
        try:
            shutil.move(whitelist_file_path_prev, whitelist_file_path)
        except Exception:
            exit(1)

    with open(whitelist_file_path, 'r') as file:
        whitelist = json.load(file)['data']

    for path in sub_paths:
        full_path = os.path.join(folder_path, path)
        process_dir(full_path, whitelist)

if __name__ == '__main__':
    main()
