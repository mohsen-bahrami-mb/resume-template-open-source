// @ts-nocheck

/** get and set data in resume editor - start */
// console.log(window.fetchEditorDataServer);
window.editor.data.set(document.querySelector("input[name=HTML_resume]").value)
let safeReload = false;
document.querySelector("#form-data").addEventListener("submit", (e) => {
	const HTML_resume = document.querySelector("input[name=HTML_resume]")
	HTML_resume.value = window.editor.data.get();
	safeReload = true;
});
window.addEventListener('beforeunload', (event) => {
	if (!safeReload) event.returnValue = `Are you sure you want to leave?`;
});
/** get and set data in resume editor - end */

/** listen to doc - start */
const filePathListenerEditorFile = new MutationObserver(() => { createElementContent(); });
filePathListenerEditorFile.observe(document.documentElement, { childList: true, subtree: true });
/** listen to doc - end */

/** create element to add content - start */
function createElementContent() {
	Array.from(document.querySelectorAll(".fm-add-to-content")).forEach(async (f) => {
		f.addEventListener("click", async () => {
			const plarentFile = f.closest("div.dropdown.d-inline");
			// get style data from the inputs
			let width100 = "100%";
			let type = plarentFile.querySelector("select[name$=\\[type\\]]").value;
			let position = plarentFile.querySelector("select[name$=\\[position\\]]").value;
			let path = plarentFile.querySelector("input[name$=\\[path\\]]").value;
			let parentWidth = plarentFile.querySelector("input[name$=\\[width\\]]").value;
			let parentHeight = plarentFile.querySelector("input[name$=\\[height\\]]").value;
			// create new element with specified type
			let newElement = "";
			if (type === "img") {
				newElement = document.createElement("img");
				newElement.src = path;
				newElement.style.width = width100;
			}
			if (type === "video") {
				newElement = document.createElement("video");
				newElement.src = path;
				newElement.style.width = width100;
			}
			if (type === "audio") {
				newElement = document.createElement("audio");
				newElement.src = path;
			}
			const positionElement = document.createElement("div");
			positionElement.style.width = width100;
			positionElement.style.display = "flex";
			positionElement.style.justifyContent = position
			// copy the element code to placement in `inser HTML`
			const innerElement = document.createElement("div");
			const element = document.createElement('div');
			element.style.width = parentWidth + "%";
			element.style.maxHeight = parentHeight + "px";
			element.style.overflow = "hidden";
			element.appendChild(newElement);
			positionElement.appendChild(element);
			innerElement.appendChild(positionElement);
			await navigator.clipboard.writeText(innerElement.innerHTML);
		});
	});
}
createElementContent();
/** create element to add content - end */

/** get file from data base - start */
async function getFileManager(inputUrl) {
	const fileManager = await fetch(inputUrl);
	let JSONFileManager;
	await (async () => await fileManager.json())().then((r) => JSONFileManager = r);
	const data = JSONFileManager && JSONFileManager.data;
	// tree directory
	let treeDir = [];
	if (data && data.url) {
		const urlArray = data.url.split("::");
		urlArray.forEach((part, index, array) => {
			let link = "";
			let linkText = "";
			for (let i = 0; i < index; i++)
				if (part.length > 0 && array[i] !== "") {
					link += i === 0 ? array[i] : ("::" + array[i]);
					linkText += i === 0 ? "/" : ("::" + array[i]);
				}
			if (link !== "" && linkText !== "")
				treeDir.push(`<div class="card m-1"><a href="${link}" class="getApiFileManager">> ${linkText}</a></div>`);
		});
	}
	treeDir = treeDir.join("");
	// files & dirs
	let filesAndDirs = [];
	if (data && data.dir) data.dir.forEach((item, index) => {
		let iName = item[2] === 'file' ? item[1].replace(/(.*\/+?)(.+)/, "$2") : item[0];
		let iNamePath = item[2] === 'file' ? item[1].replace(/(.*\/+?)(.+)/, "$1") : item[1].replace(item[0], "");
		filesAndDirs.push(`
		<tr>
			<th scope="row">
				${(item[2] === 'dir') ? "#" : `<input type="checkbox" name="fm-check-insert-file" value="${iNamePath + iName}"/>`}
			</th>
			<td>
			<a class="getApiFileManager d-block w-100" href="${(item[2] === 'dir')
				? (data.url.replace(/\/dir$/, '/dir/') + '::' + item[0]) : data.url}" target="${(item[2] === 'dir')
					? '_self' : '_blank'}">
				${iName}
			</a>
			</td>
			<td>${item[1]}</td>
			<td>${item[2] === "file" ? (item[3] / 1024 / 1024).toFixed(4) + " MB" : "-- --"}</td>
		</tr>
		`);
	});
	filesAndDirs = filesAndDirs.join("");
	document.getElementById("file-manager-modal").innerHTML = `
	<!-- file manager - start -->
	<div class="row card flex-row mx-1">
		<div class="col-12">
			<div class="border rounded my-1">
				<h5 class="text-center text-decoration-underline">tree directory</h5>
				${treeDir}
			</div>
		</div>
		<div class="col-12 p-0">
			<!-- files - start -->
			<div class="overflow-x-auto">
				<table class="table table-striped table-light table-hover mb-0 mt-0">
					<thead class="sticky-top table-warning">
						<tr>
							<th class="text-danger">select</th>
							<th class="text-danger">name</th>
							<th class="text-danger">full path (path+name)</th>
							<th class="text-danger">size</th>
						</tr>
					</thead>
					<tbody>
						${filesAndDirs}
					</tbody>
				</table>
			</div>
			<!-- files - end -->
		</div>
	</div>
	<!-- file manager - end -->	
	`;
}
async function getApiFileManager(e) {
	e.preventDefault();
	await getFileManager(e.target.href);
	listenToGetApiFileManager();
}
function listenToGetApiFileManager() {
	Array.from(document.getElementsByClassName("getApiFileManager")).forEach(t => {
		t.addEventListener("click", (e) => getApiFileManager(e));
	})
}
document.getElementById("add-file").addEventListener("click", async () => {
	await getFileManager("/edit/file-manager/api/dir");
	listenToGetApiFileManager();
});
// choose files form file manager
document.querySelector("#choose-file").addEventListener("click", () => {
	Array.from(document.querySelectorAll("input[name=fm-check-insert-file]")).forEach((ch) => {
		if (!ch.checked) return;
		createNewFileController(ch);
	});
	removeFileFromList();
});
function createNewFileController(element) {
	const newInsertFile = document.createElement("div");
	const targetElement = document.querySelector("#fm-insert-files");
	const lastChildIndex = targetElement.children.length > 0 ?
		parseInt(targetElement.children[targetElement.children.length - 1]
			.querySelector("input").attributes.name.value.replace(/(.*?\[)(\d)(\].*)/g, "$2"))
		: 0;
	newInsertFile.className = "dropdown d-inline";
	newInsertFile.innerHTML = `
	<small class="fm-remove-file small text-danger ms-1" style="cursor: pointer;">&#10008;</small>
	<button class="btn btn-sm btn-dark dropdown-toggle rounded-pill shadow-sm m-1 ms-0" type="button"
		data-bs-toggle="dropdown" aria-expanded="false">
		${element.value.replace(/(.*\/)(.*$)/g, "$2")}
	</button>
	<ul class="dropdown-menu shadow" style="width: 210px;">
		<li class="dropdown-item">
			<div class="input-group">
				<span class="input-group-text">مسیر: </span>
				<input class="form-control copy-to-clipboard" name="file[${lastChildIndex + 1}][path]" value="${element.value}" 
					copy="${element.value}" style="cursor: copy;">
			</div>
		</li>
		<li class="dropdown-item">
			<div class="input-group">
				<span class="input-group-text">عرض: </span>
				<input class="form-control" name="file[${lastChildIndex + 1}][width]" type="number" value="100"><span
					class="input-group-text">%</span>
			</div>
		</li>
		<li class="dropdown-item">
			<div class="input-group">
				<span class="input-group-text">ارتفاع: </span>
				<input class="form-control" name="file[${lastChildIndex + 1}][height]" type="number" value=""><span
					class="input-group-text">px</span>
			</div>
		</li>
		<li class="dropdown-item">
			<div class="input-group">
				<span class="input-group-text">موقعیت: </span>
				<select name="file[${lastChildIndex + 1}][position]" class="form-select form-select-sm">
					<option value="start">ابتدا سطر</option>
					<option value="center" selected>وسط سطر</option>
					<option value="end">انتهای سطر</option>
				</select>
			</div>
		</li>
		<li class="dropdown-item">
			<div class="input-group">
				<span class="input-group-text">نوع: </span>
				<select name="file[${lastChildIndex + 1}][type]" class="form-select form-select-sm">
					<option value="img">عکس</option>
					<option value="video">فیلم</option>
					<option value="audio">صدا</option>
				</select>
			</div>
		</li>
		<li class="dropdown-item">
			<button type="button" class="btn btn-sm btn-success fm-add-to-content">
				<small>کپی کد المان</small>
			</button>
		</li>
	</ul>
	`;
	targetElement.appendChild(newInsertFile);
}
function removeFileFromList() {
	Array.from(document.getElementsByClassName("fm-remove-file")).forEach(rm => {
		rm.addEventListener("click", (e) => e.target.parentElement.remove());
	});
}
removeFileFromList();
/** get file from data base - end */

/** show profile photo */
document.querySelector("input[name=profile_photo]").addEventListener("input", (e) => {
	document.querySelector("img[alt=profile_photo]").attributes.src.value = e.target.value;
});
/** add & remove skill - start */
document.querySelector(".add-skill").addEventListener("click", () => {
	const newSkill = document.createElement("div");
	const targetElement = document.querySelector("#skills");
	const lastChildIndex = parseInt(targetElement.children[targetElement.children.length - 1].querySelector("input").attributes.name.value.replace(/(.*?\[)(\d)(\].*)/g, "$2"));
	newSkill.className = "form-control small mb-1 row align-items-center mx-auto";
	newSkill.innerHTML = `
	<button type="button" class="remove-skill col-1 btn text-danger fw-bolder">&#x2212;</button>
	<div class="col-11">
		<div class="row justify-content-between align-items-center m-1">
			<label class="col-form-label-sm text-secondary col-3" style="font-size: 0.8rem;">نام
				مهارت:</label>
			<div class="col-9 p-0">
				<input type="text" name="skills[${lastChildIndex + 1}][0]" placeholder="مثلا فتوشاپ..."
					value="" class="form-control" style="font-size: 0.8rem;">
			</div>
		</div>
		<div class="row justify-content-between align-items-center m-1">
			<label class="col-form-label-sm text-secondary col-3" style="font-size: 0.8rem;">سطح
				تسلط:</label>
			<div class="wrapper col-9" dir="ltr">
				<input type="range" name="skills[${lastChildIndex + 1}][1]" min="0" max="5"
					value="1" step="1" />
			</div>
		</div>
	</div>
	`;
	targetElement.appendChild(newSkill);
	removeSkillsListener();
});
function removeSkillsListener() {
	Array.from(document.querySelectorAll(".remove-skill")).forEach(s => {
		s.addEventListener("click", (e) => e.target.parentElement.remove());
	});
}
removeSkillsListener();
/** add & remove skill - end */

/** add & remove link - start */
document.querySelector(".add-link").addEventListener("click", () => {
	const newLink = document.createElement("div");
	const targetElement = document.querySelector("#links");
	const lastChildIndex = parseInt(targetElement.children[targetElement.children.length - 1].querySelector("input").attributes.name.value.replace(/(.*?\[.*?\[)(\d)(\].*)/g, "$2"));
	newLink.className = "form-control small mb-1 row align-items-center mx-auto";
	newLink.innerHTML = `
	<button type="button" class="remove-link col-1 btn text-danger fw-bolder">
		&#x2212;
	</button>
	<div class="col-11">
		<div class="row justify-content-between align-items-center m-1">
			<label class="col-form-label-sm text-secondary col-3"
				style="font-size: 0.8rem;">نام
				لینک:</label>
			<div class="col-9 p-0">
				<input type="text" name="contact[other][${lastChildIndex + 1}][0]"
					value="" placeholder="مثلا اینستاگرام ..."
					class="form-control" style="font-size: 0.8rem;">
			</div>
		</div>
		<div class="row justify-content-between align-items-center m-1">
			<label class="col-form-label-sm text-secondary col-3"
				style="font-size: 0.8rem;">لینک:</label>
			<div class="col-9 p-0" dir="ltr">
				<input type="url" name="contact[other][${lastChildIndex + 1}][1]" value=""
					placeholder="https://instagram.com/..." class="form-control"
					style="font-size: 0.8rem;">
			</div>
		</div>
	</div>
`;
	targetElement.appendChild(newLink);
	removeLinksListener();
});
function removeLinksListener() {
	Array.from(document.querySelectorAll(".remove-link")).forEach(s => {
		s.addEventListener("click", (e) => e.target.parentElement.remove());
	});
}
removeLinksListener();
/** add & remove link - end */

/** theme configs - start */
document.querySelector("select[name=theme]").addEventListener('change', (e) => {
	const allConfigs = document.querySelectorAll("input[name^=theme_config]");
	if(!allConfigs.length) return;
	allConfigs.forEach(c => { c.parentElement.parentElement.classList.add("d-none") });
	const selector = "input[name^=theme_config\\[" + e.currentTarget.value + "\\]]";
	const targetConfigs = document.querySelectorAll(selector);
	targetConfigs.forEach(c=>{c.parentElement.parentElement.classList.remove("d-none")});
})
/** theme configs - end */