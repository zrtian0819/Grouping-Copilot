document.addEventListener("DOMContentLoaded", () => {
	// 頁面加載時自動填入上次輸入的內容
	const savedNames = localStorage.getItem("names");
	const savedNumGroups = localStorage.getItem("numGroups");

	if (savedNames) {
		document.getElementById("names").value = savedNames;
	}
	if (savedNumGroups) {
		document.getElementById("numGroups").textContent = savedNumGroups;
	} else {
		document.getElementById("numGroups").textContent = "2";
	}
});

function createGroups() {
	const names = document
		.getElementById("names")
		.value.trim()
		.split(/[ ,;\s、]+/)
		.filter((name) => name.trim() !== "");
	console.log(names);
	const numGroups = parseInt(
		document.getElementById("numGroups").textContent,
		10
	);

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
		document.getElementById("numGroups").textContent
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

	// 顯示結果後顯示分享按鈕
	document.getElementById("share-button").style.display = "block";
}

// 分享結果截圖
function shareResult() {
	const resultContainer = document.getElementById("result-container");

	// 確認有分組結果
	if (!resultContainer.innerHTML.trim()) {
		alert("請先進行分組再分享結果");
		return;
	}

	// 先創建一個臨時的截圖區域，複製結果容器內容
	const captureArea = document.createElement("div");
	captureArea.style.position = "absolute";
	captureArea.style.left = "-9999px";
	captureArea.style.background = "white";
	captureArea.style.padding = "20px";
	captureArea.style.borderRadius = "8px";
	captureArea.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
	captureArea.style.width = "500px"; // 設定截圖寬度為350px
	captureArea.style.textAlign = "center"; // 文字置中

	// 加入標題
	const title = document.createElement("h2");
	title.textContent = "分組結果";
	captureArea.appendChild(title);

	// 複製結果內容
	const resultClone = resultContainer.cloneNode(true);
	// 確保複製後的結果內容也是置中的
	const allElements = resultClone.querySelectorAll("*");
	allElements.forEach((el) => {
		if (el.tagName === "DIV" || el.tagName === "H3") {
			el.style.textAlign = "center";
		}
	});
	captureArea.appendChild(resultClone);

	// 加入日期
	const date = document.createElement("p");
	date.textContent = "產生時間: " + new Date().toLocaleString();
	date.style.fontSize = "12px";
	date.style.color = "#666";
	date.style.marginTop = "10px";
	captureArea.appendChild(date);

	document.body.appendChild(captureArea);

	// 使用html2canvas生成截圖
	html2canvas(captureArea)
		.then((canvas) => {
			// 移除臨時截圖區域
			document.body.removeChild(captureArea);

			// 轉換為圖片並下載
			const imageData = canvas.toDataURL("image/png");
			const link = document.createElement("a");
			link.href = imageData;
			link.download =
				"分組結果_" + new Date().toISOString().slice(0, 10) + ".png";
			link.click();
		})
		.catch((error) => {
			console.error("生成截圖時發生錯誤:", error);
			alert("生成截圖時發生錯誤，請再試一次");
			document.body.removeChild(captureArea);
		});
}

function adjustGroupCount(change) {
	const numGroupsElement = document.getElementById("numGroups");
	let value = parseInt(numGroupsElement.textContent) || 1;
	value += change;

	// 確保組數不會小於1
	if (value < 1) {
		value = 1;
	}

	numGroupsElement.textContent = value;
}
