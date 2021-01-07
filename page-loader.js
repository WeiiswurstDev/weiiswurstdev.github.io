// Anti Email scraper
const mail = "d2VpaXN3dXJzdGRldkBnbWFpbC5jb20="

function loadpage(pageName) {
    $(".content").html(pages[pageName].html);
    $(".content").attr("id",pageName)
    if(pages[pageName].onload) {
        pages[pageName].onload();
    }
    for(serie of tutorialSeries) {
        for(section of serie.sections) {
            section.activeCard = -1;
        }
    }
    setTimeout(()=>{
        window.scrollBy(0,-1000)
    },500)
}

$(()=>{
    let page = window.location.hash;
    if(!page || page=="") {
        page = "#startseite";
    }
    page = page.slice(1); //remove #
    if(!pages.hasOwnProperty(page)) {
        console.log("Error, page =",page)
        page = "startseite"
    }
    loadpage(page);
})

function generateStartBat(event) {
  saveTextAsFile("start.bat",
`title 1.16.4 - Server
@echo off
:start
cls
java -Xms1G -Xmx${$("#gbRAM").val()}G -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1HeapRegionSize=8M -XX:G1ReservePercent=20 -XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 -XX:InitiatingHeapOccupancyPercent=15 -XX:G1MixedGCLiveThresholdPercent=90 -XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32 -XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1 -Dusing.aikars.flags=https://mcflags.emc.gs -Daikars.new.flags=true -jar ${$("#dateiName").val()}.jar nogui
pause
goto start
Generiert von weiiswurst.dev`)
  return false;
}

function renderTutorialSeries() {
    let id = 0;
    for(serie of tutorialSeries) {
        $("#serien").append(`
            <li class="list-group-item tutorial-serie w-100">
                <div id="serie-${id}-head" class="text-white">
                    <h2 class="text-center mb-2">${serie.name}</h2>
                    <p class="d-block d-sm-none">
                        ${serie.description}
                    </p>
                    <a class="btn btn-primary d-block d-sm-none" role="button" data-toggle="collapse" data-target="#serie-${id}" aria-expanded="false" aria-controls="collapseExample">
                        Mehr anzeigen
                    </a>
                </div>
                <div class="row mx-3 collapse" id="serie-${id}">
                    <div class="col card mx-1 d-none d-sm-block"><div class="card-body">
                        <h3 class="card-title">Info</h3>
                        <p class="card-text">
                            ${serie.description}
                        </p>
                        <a href="${serie.playlistLink}" class="btn btn-primary">Zur Playlist</a>
                    </div></div>
                </div>
            </li>
        `);
        let width = $(document).width();
        if(width >= 576) {
            $("#serie-"+id).addClass("show");
        }
        let sectionID = 1;
        for(section of serie.sections) {
            $("#serie-"+id).append(`
            <div class="col-lg col-12 card mx-1"><div class="card-body">
                <h3 class="card-title">${section.name}</h3>
                <p class="card-text">
                    Clicke auf die Folge
                </p>
                <div class="btn-group" id="t-${id}-s-${sectionID}-tutorials">
                </div>
                <div class="collapse" id="t-${id}-s-${sectionID}-desc">
                </div>
            </div></div>
            `)
            let tutorialID = 1;
            for(tutorial of section.tutorials) {
                $("#t-"+id+"-s-"+sectionID+"-tutorials").append(`
                <button class="btn btn-info" type="button" onclick="showDescription(${id},${sectionID-1},${tutorialID-1})">
                    ${tutorialID}
                </button>
                `)
                tutorialID++;
            }
        }
        id++;
    }
}

function showDescription(seriesID,sectionID,tutorialID) {
    let serie = tutorialSeries[seriesID];
    if(!serie) {
        console.error("Series not found",seriesID,sectionID,tutorialID)
        return;
    }
    let section = serie.sections[sectionID];
    if(!section) {
        console.error("section not found",seriesID,sectionID,tutorialID)
        return;
    }
    let collapseID = `#t-${seriesID}-s-${sectionID+1}-desc`;

    if(section.activeCard == tutorialID) {
        $(collapseID).collapse("hide");
        section.activeCard = -1;
        return;
    }

    let tutorial = section.tutorials[tutorialID];
    if(!tutorial) {
        console.error("tutorial not found",seriesID,sectionID,tutorialID)
        return;
    }
    $(collapseID).html(`
    <p class="card-text">
        ${tutorial.desc}<br/>
        ${tutorial.practice}
    </p>
    <a href="${tutorial.youtube}" class="btn btn-primary">Zur Folge</a>
    `)
    for(link of tutorial.links) {
        $(collapseID).append(`
        <a href="${link.href}" class="btn btn-primary">${link.name}</a>
        `)
    }
    $(collapseID).collapse("show")
    section.activeCard = tutorialID;
}


// DATA
const tutorialSeries = [
    /*{
        name: "Discord.JS",
        description: "In dieser Serie erkläre ich die Programmierung eines Discord Bots mit Discord.js<br/>Vorkenntnisse mit JavaScript, z.B. aus meiner Node.JS Serie, sind <b>notwendig</b>.",
        playlistLink: "#",
        sections: [
            {
                name: "Die Basics von Discord.js",
                tutorials: [
                    {
                        desc: "In der Folge 1 befassen wir uns mit der Einrichtung.",
                        practice: "Es gibt keine Übungen.",
                        youtube: "#",
                        links: [
                            {
                                name: "Discord Developer Portal",
                                href: "https://discordapp.com/developers/applications/"
                            },
                            {
                                name: "Discord.js Download",
                                href: "https://discord.js.org/"
                            }
                        ]
                    },
                    {
                        desc: "Basisfunktionen des Bots: Starten, Status setzen",
                        practice: "Ändere den Statustext auf einen beliebigen Text deiner Wahl",
                        links: [
                            {
                                name: "Discord.js Docs",
                                href: "https://discord.js.org/#/docs/main/"
                            }
                        ]
                    }
                ],
                activeCard: -1,
            }
        ]
    }*/
    {
      name: "Minecraft Paper 1.16",
      description: "In dieser Serie erkläre ich die Programmierung eines Minecraft-Plugins mit PaperMC<br/>Vorkenntnisse mit Java sind <b>nicht notwendig</b>.",
      playlistLink: "#",
      sections: [
          {
              name: "Installation und 1. Test",
              tutorials: [
                  {
                      desc: "In der Folge 1 befassen wir uns mit der Einrichtung.",
                      practice: "Es gibt keine Übungen.",
                      youtube: "#",
                      links: [
                          {
                              name: "Java Download",
                              href: "https://adoptopenjdk.net/"
                          },
                          {
                              name: "JetBrains Toolbox",
                              href: "https://www.jetbrains.com/toolbox-app/"
                          },
                          {
                              name: "PaperMC Download",
                              href: "https://papermc.io/downloads#Paper-1.16"
                          }
                      ]
                  },
                  {
                      desc: "Das Plugin exportieren und testen",
                      practice: "Übung: Ändere den Text in der Startnachricht",
                      youtube: "#",
                      links: [
                          
                      ]
                  }
              ],
              activeCard: -1,
          }
      ]
  }
]


const pages = {
    startseite: {
        html: 
`<div class="m-5"><div class="container text-white">
        <h1 class="text-center">Weiiswurst.dev</h1>
        <h2 class="mt-5">
            Hier findest du alles zu mir: Meine Projekte und Informationen und Ressourcen zu meinen Tutorials
        </h2>
        <div class="row">
            <div class="col-12 col-md-8 mt-5">
                <h4>Über mich</h4><br/>
                Ich habe jahrelange Erfahrung mit der Entwicklung von Minecraft Spigot Plugins.<br/>
                Ich erstelle Webseiten wie diese hier und Discord Bots wie diese auf meinem Server.<br/>
                Auf YouTube bringe ich Neulingen das Programmieren mit JavaScript bei.
            </div>
            <div class="col-12 col-md-4 mt-5">
                <h4>Kontakt</h4><br/>
                <b>Empfohlen: </b>Kontakt über Discord: Weiiswurst#0016 oder auf meinem Discord Server<br/>
                <span class="text-muted">Kontakt über E-Mail: ${atob(mail)}/span>
            </div>
        </div>
    </div></div>`,
    },
    projekte: {
        html:
        `
    <div class="container-fluid p-5">
        <header class="mb-5">
            <h1 class="mb-2">Meine Projekte</h1>
            <p class="text-light">
                Dies sind die Projekte, dich ich programmiert und veröffentlicht habe.<br/>
                Auftragsprogrammierungen sind kein Teil dieser Liste und werden nicht veröffentlicht.
            </p>
        </header>
        <div class="row mx-3">
            <div class="projekt card mb-1">
                <div class="card-body">
                    <h2 class="card-title">AdminTools 3</h2>
                    <h3 class="card-subtitle mb-2 text-muted">Hilfsmittel für Serveradmins auf Deutsch!</h3>
                    <p class="card-text">
                        Dieses Projekt ist das erste, was ich je veröffentlicht habe.<br/>
                        Es arbeitet einwandfrei für Spigot 1.13+ und mit einigen Bugs für 1.8+<br/>
                        <span class="text-muted">Dieses Plugin nutzt bstats für Statistiken</span>
                    </p>
                    <a href="https://www.spigotmc.org/resources/admintools.76747/" class="btn btn-primary">Download</a>
                    <a href="https://github.com/WeiiswurstDev/AdminTools3" class="btn btn-primary">GitHub</a>
                </div>
            </div>
            <div class="projekt card ml-1 mb-1">
                <div class="card-body">
                    <h2 class="card-title">EasyConomy</h2>
                    <h3 class="card-subtitle mb-2 text-muted">Einfaches Wirtschaftssystem!</h3>
                    <p class="card-text">
                        Dieses Minecraft-Plugin ist eine einfache Möglichkeit, auf einem
                        Minecraft-Server ein Wirtschaftssystem aufzubauen! Durch die Verwendung von Vault
                        ist es mit vielen anderen Plugins kompatibel!<br/>
                        <span class="text-muted">Dieses Plugin nutzt bstats für Statistiken</span>
                    </p>
                    <a href="https://www.spigotmc.org/resources/easyconomy.81034/" class="btn btn-primary">Download</a>
                    <a href="https://github.com/WeiiswurstDev/EasyConomy/" class="btn btn-primary">GitHub</a>
                </div>
            </div>
            <div class="projekt card mb-1">
                <div class="card-body">
                    <h2 class="card-title">Minesweeper-Bot</h2>
                    <h3 class="card-subtitle mb-2 text-muted">Minesweeper auf Discord!</h3>
                    <p class="card-text">
                        Dieser Discord-Bot ermöglicht es, Minesweeper in Discord-Chats zu nutzen!
                        (?help für Befehle, @Minesweeper prefix ... um das Prefix für Befehle zu ändern)
                    </p>
                    <a href="https://discord.com/oauth2/authorize?client_id=747739891546193950&permissions=117760&scope=bot" class="btn btn-primary">Invite</a>
                </div>
            </div>
            <div class="projekt card mb-1 ml-1">
                <div class="card-body">
                    <h2 class="card-title">Start.bat - Generator</h2>
                    <h3 class="card-subtitle mb-2 text-muted">Startdatei erstellen</h3>
                    <p class="card-text">
                        Gebt einfach den Namen eurer Serverdatei und die gewünschte Menge RAM ein
                        und erhaltet eine start.bat-Datei!
                    </p>
                    <form class="form-inline">
                      <label class="sr-only" for="dateiName">Name</label>
                      <div class="input-group mb-2 mr-sm-2">
                        <input type="text" class="form-control" id="dateiName" placeholder="paper-1.16.4-420">
                        <div class="input-group-append">
                          <div class="input-group-text">.jar</div>
                        </div>
                      </div>

                      <label class="sr-only" for="gbRAM">Username</label>
                      <div class="input-group mb-2 mr-sm-2">
                        <input type="number" class="form-control" id="gbRAM" placeholder="8">
                        <div class="input-group-append">
                          <div class="input-group-text">GB</div>
                        </div>
                      </div>
                      <button type="submit" class="btn btn-primary mb-2" onclick="return generateStartBat(this)">Download</button>
                  </form>
                </div>
            </div>
        </div>
    </div>
        `
    },
    tutorials: {
        html: 
`
    <div class="container-fluid p-5">
        <header class="mb-5">
            <h1 class="mb-2">Meine Tutorial-Serien</h1>
            <p class="text-light">
                Alle Serien, deren Material ich hier veröffentlicht habe, findet ihr auf meinem YouTube-Kanal<br/>
                Ich habe hier Links zu dem Sourcecode nach jeder Folge, Übungsmaterialien und Links zu den Videos<br/>
            </p>
        </header>
        <ul class="list-group list-group-flush" id="serien">
        </ul>
    </div>
`,
        onload: renderTutorialSeries
    }
}

const saveTextAsFile = async (fileName,fileContents) => {
  if(!("showSaveFilePicker" in window)) {
    console.log("Dein Browser unterstützt das Schreiben von Dateien nicht! Du musst sie jetzt als download speichern.")
    saveBlobAsFile(fileName,fileContents)
    return;
  }
  const textFile = new File([fileContents], fileName, {
    type: "text/plain",
  });
  const handle = await window.showSaveFilePicker();
  const writable = await handle.createWritable();
  await writable.write(textFile);
  await writable.close();
}

/**
 * Save a text as file using HTML <a> temporary element and Blob
 * @see https://stackoverflow.com/questions/49988202/macos-webview-download-a-html5-blob-file
 * @param fileName String
 * @param fileContents String JSON String
 * @author Loreto Parisi
*/
var saveBlobAsFile = function(fileName,fileContents) {
  if(typeof(Blob)!='undefined') { // using Blob
      var textFileAsBlob = new Blob([fileContents], { type: 'text/plain' });
      var downloadLink = document.createElement("a");
      downloadLink.download = fileName;
      if (window.webkitURL != null) {
          downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
      }
      else {
          downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
          downloadLink.onclick = document.body.removeChild(event.target);
          downloadLink.style.display = "none";
          document.body.appendChild(downloadLink);
      }
      downloadLink.click();
  } else {
      var pp = document.createElement('a');
      pp.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(fileContents));
      pp.setAttribute('download', fileName);
      pp.onclick = document.body.removeChild(event.target);
      pp.click();
  }
}//saveBlobAsFile