# Mares-Mexicanos
Documentation for https://ajhsu3.wixsite.com/mares-mexicanos-a. Docs contain HTML components from the website.

# Submissions
The submissions page is a dynamic webpage for each divesite that ends with "user" e.g. [Clarion](
https://ajhsu3.wixsite.com/mares-mexicanos-a/update1/CLARION/user). (To change this link format, go to the Update1 User (Nombre Sitio) page settings on the Wix Editor). 
After choosing a file and clicking upload, the HTML code will upload the file to [Dropbox](https://www.dropbox.com/sh/wuzzxg4scugdczp/AABxXF0yRyzLp2CPfNA2Rg6Qa?dl=0) and create a link for each file. The link will be saved into the database once the user hits submit.

# Approval
Navigate to the Submissions-final page (URL not available currently) on Wix to approve image submissions. Link to video and description approval is present on the page. Upon clicking "Add," images are watermarked using Javascript and transferred to "downloadToWix" database. The HTML also uploads a copy to the [Atlas Images Folder](https://www.dropbox.com/sh/58l5ubjgp9v80pl/AAD5TSWpV60rpa6pdXAq8gvAa?dl=0) on dropbox. 

**Note:** once files are added to the Atlas Image Folder, the un-watermarked versions can be deleted from the [Watermark Needed Folder](https://www.dropbox.com/sh/wuzzxg4scugdczp/AABxXF0yRyzLp2CPfNA2Rg6Qa?dl=0) to save space.

To prevent loss of resolution and give Wix authorization to resize images without cropping, images must be downloaded to the Wix Media Manager. Currently there does not seem to be a way to programmatically upload files to the Media Manager. Tried to use WixMP but it seems to be deprecated https://console.wixmp.com/platform/external-user, maybe looking into https://github.com/wix/media-platform-java-sdk might provide a solution. 

# Custom Javascript
To bypass this problem, please download the Chrome extension "Custom Javascript for Websites," and after opening the [Wix Editor]( https://editor.wix.com/html/editor/web/renderer/edit/21569840-025d-43de-8b03-a334c8b939b0?metaSiteId=dac2ffff-65c3-4efe-b08c-af143a2fc025&editorSessionId=de3608d2-6017-47fa-ba34-53308d3954aa&referralInfo=dashboard) and logging in, insert the [Mares-Mexicanos/docs/wixSnippet](https://raw.githubusercontent.com/wjc011/Mares-Mexicanos/master/docs/wixSnippet.js) code into the extension as seen below. 

![GitHub Logo](https://www.dropbox.com/s/6dgo1pc4kqgew7b/69980026_934934786845855_4816457028169891840_n.png?raw=1)

This program will automatically execute everytime the Wix Editor is opened on that device and will upload any images that are in the "downloadToWix" database step-by-step. Once the script finishes running, the watermarked images will be on the live site. Because the images are now stored in the Wix Media Manager, the script will delete the dropbox folder containing the images (the folder will be re-created everytime a new file is uploaded), so the only copies of the watermarked image are in the Media Manager and the Atlas Images folder.

# Databases
There are seven databases on the Wix page:
* **update1 -** the main database. This database contains all of the dive sites, along with their descriptions, photos, and videos. Videos are stored in separate columns - vid1, vid2, vid3, vid4, and vid5. Photos are stored as a json array under the pictures column, with each json object consisting of the picture's link, date (date of picture taken), email, and the name of the user who submitted it. 
* **diveSites -** this database is a subset of the update1 database. diveSites was created to act as a smaller dataset that would be used by the Atlas page, allowing it to load faster. It contains only the name, longitude, latitude, description, summary and a fuente (icon) for each dive site from update1. 
* **toursimOperators -** also feeds in to the Atlas page, allowing it to display tourism operators. The pictures of each operator are stored in the photo column and link to the dropbox folder [Tourism Operators](https://www.dropbox.com/sh/inenqci41qmdxzk/AADABJmRtWmjBFm-TTo6k4AQa?dl=0), created on a separate dropbox account to save space. Opening hours and ratings have also been saved into the database. These were acquired by using the operators "helper" page, which found each location through Google's [Place Services API](https://developers.google.com/places/web-service/intro).
* **toWatermark -** user submitted images go here first for admin approval. Items are organized by site name and contain a dropbox photo link, any information the user has given (date, name, email) and the unique path created in the corresponding [dropbox](https://www.dropbox.com/sh/wuzzxg4scugdczp/AABxXF0yRyzLp2CPfNA2Rg6Qa?dl=0) folder. After admin approval on the Submissions-final page, the item will be deleted and a duplicate item will be created in the downloadToWix database, however this time with a link to a watermarked image temporarily available in the Submissions folder (this folder will be deleted everytime we upload the final watermarked image into the Wix Media Manager so we don't have copies of these images stored on multiple platforms).
* **downloadToWix -** response column contains the watermarked link, and the path contains the watermarked image's path in the Submissions folder from Dropbox. Submitted images retain their user information in the info column. The item's id is also used in the database so that a post request is able to delete each item after it has been uploaded to the Media Manager.
* **submissionText -** contains user submitted page descriptions and summaries.
* **submissionVideos -** contains user subitted videos. Note: the [Watermark Needed folder](https://www.dropbox.com/sh/wuzzxg4scugdczp/AABxXF0yRyzLp2CPfNA2Rg6Qa?dl=0) is a misnomer considering videos are also stored in the folder before being transferred to the Atlas Images upon admin approval. Videos are not watermarked.



