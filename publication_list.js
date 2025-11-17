// ----------------------------------------------------------
// 工具：获取某一类 checkbox 的勾选值
// ----------------------------------------------------------
function getChecked(className) {
    return [...document.querySelectorAll("." + className + ":checked")].map(x => x.value);
}

// ----------------------------------------------------------
// 工具：强制至少一个 checkbox 被选中
// ----------------------------------------------------------
function enforceAtLeastOne(className) {
    let boxes = document.querySelectorAll("." + className);

    boxes.forEach(cb => {
        cb.addEventListener("change", function () {
            let checked = [...boxes].filter(x => x.checked);
            if (checked.length === 0) {
                this.checked = true;
            }
        });
    });
}

// ----------------------------------------------------------
// Reset：保留第一个，其余全部取消
// ----------------------------------------------------------
function resetCategory(className) {
    let boxes = document.querySelectorAll("." + className);
    boxes.forEach((box, index) => {
        box.checked = (index === 0); // 只选第一个
    });
}

// ----------------------------------------------------------
// 渲染函数
// ----------------------------------------------------------
function renderPublications(json) {
    var table = document.getElementById("publication_table");
    table.innerHTML = ""; // 清空旧内容

    // 获取过滤条件
    let f_authorship = getChecked("filter-authorship");
    let f_area = getChecked("filter-area");
    let f_venue = getChecked("filter-venue");

    for (let i = 0; i < json.length; i++) {

        let tags = json[i].tags || {};
        let t_authorship = Array.isArray(tags.authorship) ? tags.authorship : [];
        let t_area = Array.isArray(tags.area) ? tags.area : [];
        let t_venue = Array.isArray(tags.venue) ? tags.venue : [];

        // ============= 过滤逻辑 =============
        if (f_authorship.length > 0 && !t_authorship.some(t => f_authorship.includes(t))) continue;
        if (f_area.length > 0 && !t_area.some(t => f_area.includes(t))) continue;
        if (f_venue.length > 0 && !t_venue.some(t => f_venue.includes(t))) continue;

        // ============= 创建行 =============
        var newRow = document.createElement("tr");
        var cell = document.createElement("td");
        cell.style.cssText = "padding:20px; vertical-align:top;";
        newRow.appendChild(cell);
        table.appendChild(newRow);

        // ============= 左右两列布局容器 =============
        var container = document.createElement("div");
        container.style.display = "flex";
        container.style.alignItems = "flex-start";
        container.style.gap = "20px";
        cell.appendChild(container);

        // ============= 左栏：图片 =============
        if (json[i].img && json[i].img.trim() !== "") {
            var imgDiv = document.createElement("div");
            imgDiv.style.width = "160px";
            imgDiv.style.height = "120px";
            imgDiv.style.flex = "0 0 160px";
            imgDiv.style.display = "flex";
            imgDiv.style.justifyContent = "center";
            imgDiv.style.alignItems = "center";
            imgDiv.style.overflow = "hidden"; // 裁剪

            var img = document.createElement("img");
            img.src = json[i].img;

            // 固定窗口，图片居中裁剪
            img.style.width = "100%";
            img.style.height = "100%";
            img.style.objectFit = "cover";
            img.style.objectPosition = "center";
            img.style.borderRadius = "10px";

            imgDiv.appendChild(img);
            container.appendChild(imgDiv);
        }

        // ============= 右栏：文本内容 =============
        var textDiv = document.createElement("div");
        textDiv.style.flex = "1";
        container.appendChild(textDiv);

        // ---------- 标题 ----------
        var name_a = document.createElement("a");
        if (json[i]["ref"] && json[i]["ref"].trim() !== "") {
            name_a.href = json[i]["ref"];
            name_a.target = "_blank";
            name_a.rel = "noopener noreferrer"; // 安全
        }

        var name_span = document.createElement("span");
        name_span.className = "papertitle";
        name_span.innerHTML = json[i]["name"];
        name_span.style.fontSize = "18px";
        name_span.style.fontWeight = "600";

        name_a.appendChild(name_span);
        textDiv.appendChild(name_a);
        textDiv.appendChild(document.createElement("br"));

        // ---------- 作者 ----------
        var author = json[i]["author"] || [];
        for (var j = 0; j < author.length; j++) {
            if (j !== 0) textDiv.appendChild(document.createTextNode(", "));

            let a = author[j];
            if (a["name"] === "Zhiqi Li" || a["name"] === "Zhiqi Li*") {
                var strongAuthor = document.createElement("strong");
                strongAuthor.innerHTML = a["name"];
                textDiv.appendChild(strongAuthor);
            } else {
                var author_item = document.createElement("a");
                author_item.innerHTML = a["name"];
                if ("ref" in a) author_item.href = a["ref"];
                textDiv.appendChild(author_item);
            }
        }

        if (json[i]["cofirst"]) {
            textDiv.appendChild(document.createTextNode(" (* co-first author)"));
        }

        textDiv.appendChild(document.createElement("br"));

        // ---------- Conference ----------
        var conference_item = document.createElement("em");
        conference_item.innerHTML = json[i]["conference"] || "";
        textDiv.appendChild(conference_item);

        textDiv.appendChild(document.createElement("br"));

        // ---------- Description ----------
        var desc_item = document.createElement("p");
        desc_item.innerHTML = json[i]["description"] || "";
        desc_item.style.marginTop = "6px";
        desc_item.style.marginBottom = "0px";
        textDiv.appendChild(desc_item);
    }
}

// ----------------------------------------------------------
// 主逻辑入口
// ----------------------------------------------------------
window.addEventListener("DOMContentLoaded", function () {

    // 默认全选
    document.querySelectorAll("input[type=checkbox]").forEach(cb => cb.checked = true);

    fetch('./data/publications.json')
        .then(response => response.json())
        .then(json => {

            // 初次渲染
            renderPublications(json);

            // 强制每组至少一个
            enforceAtLeastOne("filter-authorship");
            enforceAtLeastOne("filter-area");
            enforceAtLeastOne("filter-venue");

            // 绑定 checkbox 事件
            document.querySelectorAll("input[type=checkbox]").forEach(cb => {
                cb.addEventListener("change", () => renderPublications(json));
            });

            // Reset 按钮逻辑
            document.querySelectorAll(".reset-btn").forEach(btn => {
                btn.addEventListener("click", () => {
                    let target = btn.getAttribute("data-target");
                    resetCategory(target);
                    renderPublications(json);
                });
            });
        })
        .catch(error => console.error('Error:', error));
});
