document.addEventListener("DOMContentLoaded", () => {
	// 頁面加載時自動填入上次輸入的內容
	const savedNames = localStorage.getItem("names");
	const savedNumGroups = localStorage.getItem("numGroups");

	if (savedNames) {
		document.getElementById("names").value = savedNames;
	}
	if (savedNumGroups) {
		document.getElementById("numGroups").value = savedNumGroups;
	}
});

function createGroups() {
	const names = document
		.getElementById("names")
		.value.trim()
		.split(/[ ,;\s、]+/);
	console.log(names);
	const numGroups = parseInt(document.getElementById("numGroups").value, 10);

	if (names.length === 0 || numGroups <= 0) {
		alert("請輸入有效的人員名單和組數");
		return;
	}

	// 儲存輸入的內容到 localStorage
	localStorage.setItem(
		"names",
		document.getElementById("names").value.trim()
	);
	localStorage.setItem(
		"numGroups",
		document.getElementById("numGroups").value
	);

	// 洗牌算法隨機打亂人員順序
	for (let i = names.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[names[i], names[j]] = [names[j], names[i]];
	}

	const groups = Array.from({ length: numGroups }, () => []);

	names.forEach((name, index) => {
		groups[index % numGroups].push(name);
	});

	const resultContainer = document.getElementById("result-container");
	resultContainer.innerHTML = "";

	let delay = 200; // 初始延遲
	groups.forEach((group, index) => {
		const groupDiv = document.createElement("div");
		groupDiv.className = "group";
		groupDiv.innerHTML = `<h3>組${index + 1}</h3>`;
		group.forEach((name) => {
			const nameDiv = document.createElement("div");
			nameDiv.textContent = name;
			groupDiv.appendChild(nameDiv);
		});
		resultContainer.appendChild(groupDiv);

		const nameDivs = groupDiv.querySelectorAll("div");
		nameDivs.forEach((div) => {
			setTimeout(() => {
				div.classList.add("expand");
			}, delay);
			delay += 50; // 每個名字延遲增加 50ms
		});
	});
}

function adjustGroupCount(change) {
	const numGroupsInput = document.getElementById("numGroups");
	let value = parseInt(numGroupsInput.value) || 1;
	value += change;

	// 確保組數不會小於1
	if (value < 1) {
		value = 1;
	}

	numGroupsInput.value = value;
}
