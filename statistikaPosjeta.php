<?php
/*
dv at josheli.com

Proxy for viewing Awstats outside of cpanel. I assume no liability.



*/

$user = 'dalmacij';//your cpanel username
$pass = 'MgtEqvHW2cDv';//your cpanel password
$domain = 'dalmacija-ribolov.hr';//do not include 'http://' or 'www.'

/*
Domain of the stats you wish to view, e.g. a subdomain like "cvs.mydomain.com".
If left blank, defaults to the "domain" above
Another option is to set the "config" parameter in the url of your browser, e.g.:
http://www.domain.com/awstats.php?config=sub.domain.com
*/
$config_domain = '';

/*
If you don't know what you're doing, set $dynamic_images equal
to TRUE, and don't worry about the $image_directory variable.
Otherwise,
- Normally, this script will load images by proxy, i.e. awstats.php
is called for each <img> tag and will send the correct
image to the browser. This is not the way the web is designed
to work. So, if you wish to improve performance and lower
bandwidth, you can:
1. Set $dynamic_images to FALSE
2. Create an image directory in your webroot
3. Copy all of awstats image sub-directories to this new directory
4. Point the $image_directory variable to your new directory
You will get all the benefits of cached, static images.
In order to get the Awstats images and their directories, you will
probably need to download an awstats distribution from
awstats.sourceforge.net. The final layout will probably look like this:

awstats_imagedir/
browser/
clock/
cpu/
flags/
mime/
os/
other/

Under each of those sub-directories will be dozens of .png files.
*/

$dynamic_images = true;
$image_directory = './awstats_images/';

//lame attempt to combat referrer spam
$spam_words = array('mortgage', 'sex', 'porn', 'cock', 'slut', 'facial', 'loving', 'gay', '.ro');


/***********
NO NEED TO TOUCH ANYTHING BELOW HERE
************/

//retrieves the file, either .pl or .png
function get_file($fileQuery)
{
global $user, $pass, $domain;
return file_get_contents("http://$user:$pass@$domain:2082/".$fileQuery);
}

$requesting_image = (strpos($_SERVER['QUERY_STRING'],'.png')===false)?false:true;

if($requesting_image) //it's a .png file...
{
if(!$dynamic_images && !is_dir($image_directory))
{
exit;
}
$fileQuery = $_SERVER['QUERY_STRING'];
}
elseif(empty($_SERVER['QUERY_STRING']))//probably first time to access page...
{
if(empty($config_domain))
{
$config_domain = $domain;
}
$fileQuery = "awstats.pl?config=$config_domain";
}
else //otherwise, all other accesses
{
$fileQuery = 'awstats.pl?'.$_SERVER['QUERY_STRING'];
}

$file = get_file($fileQuery);

//check again to see if it was a .png file
//if it's not, replace the links
if(!$requesting_image)
{
$file = str_replace('awstats.pl', basename($_SERVER['PHP_SELF']), $file);

if($dynamic_images)
{
$imgsrc_search = '="/images';
$imgsrc_replace = '="'.basename($_SERVER['PHP_SELF']).'?images';
}
else
{
$imgsrc_search = 'src="/images/awstats/';
$imgsrc_replace = 'src="'.$image_directory;
}

$file = str_replace($imgsrc_search, $imgsrc_replace, $file);
$file = str_replace($spam_words, 'SPAM', $file);
}
else //if it is a png, output appropriate header
{
header("Content-type: image/png");
}

//output the file
echo $file;
?> 