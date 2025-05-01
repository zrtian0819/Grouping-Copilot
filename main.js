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
	});
}
