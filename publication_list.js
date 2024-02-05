fetch('./data/publications.json',{mode: 'no-cors'})
    .then(response => response.json())
    .then(json => {
        var arrayLength = json.length; 
        for (var i = 0; i < json.length; i++) {
            var name = json[i]["name"]; 
            var pub_ref = json[i]["ref"];   
            var author = json[i]["author"]; 
            var conference = json[i]["conference"]; 
            var description=json[i]["description"];
            console.log(name)
            var table = document.getElementById("publication_table");
            var newRow = document.createElement("tr");
            var cell1 = document.createElement("td");
            cell1.style.cssText = "padding:20px;width:70%;vertical-align:middle";
            newRow.appendChild(cell1);      
            table.appendChild(newRow);
            
            var name_a = document.createElement("a");
            name_a.href=pub_ref;
            var name_span=document.createElement("span");
            name_span.className="papertitle";
            name_span.innerHTML=name;
            name_a.appendChild(name_span);
            cell1.appendChild(name_a);

            var author_br1=document.createElement("br");
            cell1.append(author_br1)
            for (var j = 0; j < author.length; j++) {
                if(j!=0){
                    var commaText = document.createTextNode(", ");
                    cell1.appendChild(commaText);
                }
                if(author[j]["name"] === "Zhiqi Li" || author[j]["name"] === "Zhiqi Li*"){
                    var author_item = document.createElement("strong");
                    author_item.innerHTML=author[j]["name"];
                    if("ref" in author[j]){
                        console.log(author[j]["name"]);
                        author_item.href=author[j]["ref"]
                    }
                    cell1.appendChild(author_item)
                }
                else{
                    var author_item=document.createElement("a");
                    author_item.innerHTML=author[j]["name"];
                    if("ref" in author[j]){
                        console.log(author[j]["name"]);
                        author_item.href=author[j]["ref"]
                    }
                    cell1.appendChild(author_item)
                }
            }
            if(json[i]["cofirst"]){
                var commaText = document.createTextNode(" (* co-first author)");
                cell1.appendChild(commaText);
            }
            var author_br2=document.createElement("br");
            cell1.append(author_br2);
            var conference_item=document.createElement("em");
            conference_item.innerHTML=conference;
            cell1.appendChild(conference_item);
            var author_br3=document.createElement("br");
            cell1.append(author_br3);
            var description_item=document.createElement("p");
            description_item.innerHTML=description;
            cell1.append(description_item);

//            var td_element = document.createElement('td');
//            td_element.style = 'padding:20px;width:90%;vertical-align:middle';
//            document.body.appendChild(newElement);
//            document.write("<td style=\"padding:20px;width:90%;vertical-align:middle\">");
//            document.write("<a href="+pub_ref+">");
//            document.write("<span class=\"papertitle\">"+name+"</span>");
 //           document.write("</a>");
//            <a href="https://arxiv.org/abs/2302.14365">
//            <span class="papertitle">RemoteTouch: Enhancing Immersive 3D Video Communication with Hand Touch
//            </span>
//            </a>
//            document.write("</td>")
          }        

        
        //document.getElementById('content').textContent = JSON.stringify(json, null, 2);
    })
    .catch(error => console.error('Error:', error));
