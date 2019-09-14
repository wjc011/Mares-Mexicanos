# Mares-Mexicanos
Documentation for https://ajhsu3.wixsite.com/mares-mexicanos-a. Docs contain HTML components from the website.

# Submissions
The submissions page is a dynamic webpage for each divesite that ends with "user" e.g. [Clarion](
https://ajhsu3.wixsite.com/mares-mexicanos-a/update1/CLARION/user). (To change this link format, go to the Update1 User (Nombre Sitio) page settings on the Wix Editor) 
After choosing a file and clicking upload, the HTML code will upload the file(s) to [Dropbox](https://www.dropbox.com/sh/wuzzxg4scugdczp/AABxXF0yRyzLp2CPfNA2Rg6Qa?dl=0) and create a link(s) for each file. These will be saved into the database once the user hits submit.

# Approval
Navigate to the Submissions-final page (URL not available currently) on Wix to approve image submissions. Link to video and description approval is present on the page. Upon clicking "Add," images are watermarked using Javascript and transferred to "downloadToWix" database. To prevent loss of resolution and give Wix authorization to resize images without cropping, images must be downloaded to the Wix Media Manager. Currently there does not seem to be a way to programmatically upload files to the Media Manager. Tried to use WixMP but it seems to be deprecated https://console.wixmp.com/platform/external-user, maybe looking into https://github.com/wix/media-platform-java-sdk might provide a solution. 

# Custom Javascript
To bypass this problem, please download the Chrome extension "Custom Javascript for Websites," and after opening the [Wix Editor]( https://editor.wix.com/html/editor/web/renderer/edit/21569840-025d-43de-8b03-a334c8b939b0?metaSiteId=dac2ffff-65c3-4efe-b08c-af143a2fc025&editorSessionId=de3608d2-6017-47fa-ba34-53308d3954aa&referralInfo=dashboard) and logging in, insert the Mares-Mexicanos/docs/wixSnippet code into extension. 

![GitHub Logo](https://www.dropbox.com/s/6dgo1pc4kqgew7b/69980026_934934786845855_4816457028169891840_n.png?raw=1)



