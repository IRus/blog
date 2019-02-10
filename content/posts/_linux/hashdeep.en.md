---
title: "Hashdeep"
date: 2019-02-11
categories:
  - Linux
---

I found [hashdeep](http://md5deep.sourceforge.net/) very useful for files integrity audition. 

For my purpose I used two commands:

```bash
hashdeep -c sha1 -r ./test/ > hashdeep-hashes-2019-02-11.txt
```

and 

```bash
hashdeep -c sha1 -r ./test/ -X -k hashdeep-hashes-2019-02-11.txt
```

First command traverses passed directory, and all subdirectories and writes in stdout files size, computed hashes and path:

```text
%%%% HASHDEEP-1.0
%%%% size,sha1,filename
## Invoked from: /home/yoda/Desktop
## $ hashdeep -c sha1 -r ./test/
## 
3677111,6a326d3af131449f1f27d6e2c3a94ba697805b03,/home/yoda/Desktop/test/sv-jug-adba-5022946.pdf
4833844,1da68b71c99be03f0f6a5d5f82ebfab3ebf4c821,/home/yoda/Desktop/test/thesis.pdf
```

Second command used to verify, that content in particular folder matches file sizes and hashes from previously created folder:

```text
%%%% HASHDEEP-1.0
%%%% size,sha1,filename
## Invoked from: /home/yoda/Desktop
## $ hashdeep -c sha1 -r -X -k hashdeep-hashes-2019-02-11.txt ./test/
## 
296,6c004046edc8bf2efb99a185e68895be610f10d7,/home/yoda/Desktop/test/sv-jug-adba-5022946.pdf
```

in this case **hashdeep** reports that content of `sv-jug-adba-5022946.pdf` was changed.
