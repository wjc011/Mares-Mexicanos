  /* ==WixSnippet==
  *  @match        https://editor.wix.com/html/editor/web/renderer/edit/21569840-025d-43de-8b03-a334c8b939b0?metaSiteId=dac2ffff-65c3-4efe-b08c-af143a2fc025&editorSessionId=7c538212-3238-4a8a-bbca-4d7e3089793e&referralInfo=dashboard
  *  Use with Custom Javascript -- Download Custom Javascript at https://chrome.google.com/webstore/detail/custom-javascript-for-web/ddbjnfjiigjmcpcpkmhogomapikjbjdk?hl=en
  *  and insert the script on the Wix editor link.
  *  When the website is loaded, execute a series of click events that will navigate to the Media Manager and then upload from Dropbox. The script will
  *  select the Submissions folder, which will contain pictures that have been approved and watermarked. Once uploaded to the Media Manager, the script
  *  will access information from the Media Manager page to create a link that is compatible with Wix's gallery. The script sends a post request to Wix's
  *  backend to update the database with the appropriate divesite to contain the link.
  *  NOTE: if the format of the Media Manager changes, the elements may have to be changed accordingly.
  */

  /*define usable double click event */
  var event = new MouseEvent('dblclick', {
      'view': window,
      'bubbles': true,
      'cancelable': true
    });
  var length; //number of watermarked pics
  onload();
  var dropboxToken = "A9ShmY73j1AAAAAAAAAAdbCqOy-D-yFnlqjG-YG-XwSw0auys-_Xj1rNEUQKtz92"; //Oauth Key

  /*Before Wix is loaded, there is a waiting period where we cannot access the elements on the page.
  * Wait until the first element is no longer undefined before executing the rest of the script. If it 
  * is undefined, await and check again. Unfortunately, this portion of code runs infinitely since it looks
  * like custom javascript is running twice on the page rather than just once.
  */
  function onload(){

  if(document.getElementsByClassName("wix-code-pages-tree rootType")[0]!== undefined){
  var response;

  /*Request Wix for the downloadToWix database information */
  var xmlHttp = new XMLHttpRequest();
      xmlHttp.open( "GET", "https://ajhsu3.wixsite.com/mares-mexicanos-a/_functions/myFunction"); // false for synchronous request
      xmlHttp.onreadystatechange = function() {
           response = JSON.parse(xmlHttp.response);
           length = response.length;
  document.getElementsByClassName("left-bar-item add-panel")[0].click(); //Add
  setTimeout(function(){
  document.getElementsByClassName("control-label with-ellipsis category-name")[2].click(); //Images
  setTimeout(function(){
  document.getElementsByClassName("listItemWithImage")[0].click(); //Upload Images

  recursiveDL(0, response);



  }, 1000);
  }, 1000);
      }
      xmlHttp.send();
      return;
    }
    else{
      setTimeout(function(){

      console.warn("checking");
      return onload();
        }, 3000);

    }

  }

  /*count is less than length of images, item is the array of sites {url, name, info}. Goes through
  * each item one by one and uploads them.
  */
  function recursiveDL(count, item){
   if(count >= length){ //stop recursing and delete the Submission Photos file
      var xhr = new XMLHttpRequest(); // XMLHTTP object
      xhr.open('POST', 'https://api.dropboxapi.com/2/files/delete_v2');
      //documentation at https://www.dropbox.com/developers/documentation/http/documentation
      xhr.setRequestHeader('Authorization', 'Bearer ' + dropboxToken);
      xhr.setRequestHeader('Content-Type', 'application/json');
      var data = JSON.stringify({
              path: "/Submission Photos",
        })
  xhr.send(data);
     return;
   }
   //Wait a couple seconds for the elements to load
  setTimeout(function(){
  for (var i =0; i<300; i++){
  /*Click the Upload Media button */
  if (document.getElementById("mediaGalleryFrame").contentWindow.document.getElementsByClassName("buttonnext616398440--content")[i].innerText === "+ Upload Media"){ //Upload Media
    document.getElementById("mediaGalleryFrame").contentWindow.document.getElementsByClassName("buttonnext616398440--content")[i].click();
    break;
  }
  }
  setTimeout(function(){
  document.getElementById("mediaGalleryFrame").contentWindow.document.getElementsByClassName("_2-3hW")[5].click(); //Dropbox



  setTimeout(function(){

  document.getElementById("mediaGalleryFrame").contentWindow.document.getElementsByClassName("qzXfo _1msmz")[3].dispatchEvent(event); //Submission Folder
  setTimeout(function(){
    console.log(document.getElementById("mediaGalleryFrame").contentWindow.document.getElementsByClassName("_1zFlU _2WqP0").length);
  for (var i =0; i<document.getElementById("mediaGalleryFrame").contentWindow.document.getElementsByClassName("_1zFlU _2WqP0").length; i++){
      console.log(document.getElementById("mediaGalleryFrame").contentWindow.document.getElementsByClassName("_1UnFf")[i].innerText);

    if(document.getElementById("mediaGalleryFrame").contentWindow.document.getElementsByClassName("_1UnFf")[i].innerText === item[count].path){ //check the name of file
    document.getElementById("mediaGalleryFrame").contentWindow.document.getElementsByClassName("_1zFlU _2WqP0")[i].click();
    break;
  }
  }
  setTimeout(function(){




    for(var i=0; i<500; i++){
      try{ //try accessing the innerText
    var title = document.getElementById("mediaGalleryFrame").contentWindow.document.getElementsByClassName("buttonnext616398440--content")[i].innerText;
      }
      catch{
        console.log(i);
      }
    if (title === 'Upload Selection (1)'){
       document.getElementById("mediaGalleryFrame").contentWindow.document.getElementsByClassName("buttonnext616398440--content")[i].click(); //Upload Selection
       break;
    }
    }
  setTimeout(function(){
  //await download to Media Manager
  var waitForUpload = timeoutms => new Promise((r, j)=>{
      var check = () => {
        console.warn('checking')

        var uploadStatus = document.getElementById("mediaGalleryFrame").contentWindow.document.getElementsByClassName("_1tWNi _19Kx3")[0]; //Uploading

        if(!uploadStatus){
                    console.log("upload is done");
  document.getElementById("mediaGalleryFrame").contentWindow.document.getElementsByClassName("_2K8zb")[6].click();
  var wixName = document.getElementById("mediaGalleryFrame").contentWindow.document.getElementsByClassName("_2K8zb")[6].innerText; 
  setTimeout(function(){
  //get the resolution. Necessary for creating the usable link
   var resolution;

      resolution = document.getElementById("mediaGalleryFrame").contentWindow.document.getElementsByClassName("_2FABd")[2].innerText; //Resolution
      resolution = resolution.substring(10, resolution.length);
      resolution = resolution.replace(/\s/g, '');


  setTimeout(function(){
  //the usable link states the origin height and width presumably for resizing purposes
  var link = document.getElementById("mediaGalleryFrame").contentWindow.document.getElementsByClassName("_2K8zb")[6].dataset.hookItemId; //first 6 are folders
  resolution = resolution.replace('px', '');
  resolution = resolution.split('x').join('&originHeight=');
  resolution = '#originWidth=' + resolution;
  link = "wix:image://v1/" + link + '/' + wixName + resolution;

  var id = item[count]._id;
  var site = item[count].name;
  var date = item[count].info.date;
  var name = item[count].info.name;
  var email = item[count].info.email;
  var xhrpost = new XMLHttpRequest();

  //create a post request to send the link
  var url = "https://ajhsu3.wixsite.com/mares-mexicanos-a/_functions/myFunctionA";
  xhrpost.open("POST", url);
  xhrpost.onreadystatechange = function () {
      if (xhrpost.readyState === 4 && xhrpost.status === 201) {
          var json = JSON.parse(xhrpost.responseText);
          console.log(json);
      }
  };
  //also save the user's name, date and email information and the name of divesite
  var data = JSON.stringify({"name": site, "link": link, "user": name,
  "date": date, "email": email, "id": id});
  xhrpost.send(data);




  recursiveDL(count+1, item);


  }, 3000);
  }, 3000);
          r()

  }
  //})

        else if((timeoutms -= 2000) < 0)
          j('timed out!')
        else
          setTimeout(check, 2000)
      }
      setTimeout(check, 2000)
    })//setTimeout(()=>{e.innerHTML='Hello world'}, 1000)  (async ()=>{

      waitForUpload(200000)



  }, 3000);
  }, 3000);
  }, 3000);
  }, 10000);
  }, 1000);
  }, 1000);
  }

  //No longer used
  async function isUploadDone(){
  var text = document.getElementById("mediaGalleryFrame").contentWindow.document.getElementsByClassName("_1tWNi _19Kx3")[0].innerText;
    if (text.endsWith("Uploading")){
  setTimeout(function(){
    console.log("still uploading");
      isUploadDone();
      }, 1000);
    }
    else{
    return true;
  }

  }

