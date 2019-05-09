---
title: "How-to: AWstats installation and configuration on Debian"
date: 2014-11-08
categories:
  - Linux
---

This is a simple tutorial on how to install AWstats on Debian and configure it for displaying web statistics. I've tried this on lenny, but it should also work on other versions with small or no modifications.

First, make sure your web server is configured to write access logs to combined format. This is default behavior for nginx and lighttpd servers, but not for apache. To tell apache to use combined format, use something like this:

```
CustomLog logs/access_log combined
```

Install awstats package:

```
apt-get install awstats
```

Create a config file for our new domain:

```
cp /etc/awstats/awstats.conf /etc/awstats/awstats.www.example.com.conf
```

Edit this lines in new configuration file:

```
LogFile="/var/log/nginx/access.www.example.com.log"
LogFormat=1
SiteDomain="www.example.com"
DNSLookup=0
DirData="/var/lib/awstats/www.example.com/"
HostAliases="example.com"
```

Create a database directory:

```
mkdir /var/lib/awstats/www.example.com/
```

OK, configuration is now done, we can create some stats... simplest way is by using awstats.pl:

```
/usr/lib/cgi-bin/awstats.pl -config=www.example.com -update -output > /www/sites/www.example.com/awstats.html
```

But, this will only create main reports. To create all reports, you can use awstats_buildstaticpages.

It's a good idea to save this command into a script file (e.g. /data/bin/awstats/awstats_update_example) which can be easily called when we need to update stats.

```
/usr/share/doc/awstats/examples/awstats_buildstaticpages.pl -update -config=www.example.com -dir=/www/sites/webstats.example.com/ -awstatsprog=/usr/lib/cgi-bin/awstats.pl > /dev/null
```

Updating can be done from cron, but that can result in lost data, because of log rotation. Best option is to call update script just before logs are rotated. Nginx logs are, by default, rotated daily, so we can just insert our script in nginx logrotate configuration file (/etc/logrotate.d/nginx):
  
```
/var/log/nginx/*.log {
    daily
    ...
    sharedscripts
    prerotate
        /data/bin/awstats/awstats_update_example
    endscript
    ...
}
```

You can try to run logrotate manually with:

```
logrotate -vf /etc/logrotate.conf
```

OK, now we just need to make html files available from web.

I will post configuration for nginx, but that can be easily adapted for other web servers.

This is an example of virtual host file (e.g. /etc/nginx/sites-enabled/webstats.example.com):

```
server {
    listen 80;
    server_name  webstats.example.com;

    location / {
        root   /www/sites/webstats.example.com/;
        index  awstats.www.example.com.html;
    }

    location  /awstats-icon/ {
        alias  /usr/share/awstats/icon/;
    }

    auth_basic            "Restricted";
    auth_basic_user_file  /etc/awstats/webstats.example.com.htpasswd;

    access_log /var/log/nginx/access.webstats.example.com.log;
    error_log /var/log/nginx/error.webstats.example.com.log;
}
```

Create a password file:

```
htpasswd -c /etc/awstats/webstats.example.com.htpasswd master
```

Reload nginx configuration:

```
/etc/init.d/nginx reload
```

And we're done.

AWstats beside this static pages also supports dynamic CGI reports, but that is slower and less secure, so unless you don't really need that, static pages will do just fine.
