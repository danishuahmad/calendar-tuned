//  TODO
//  make it dynamic to auto generate minutes against given slot size. 
//  e.g. slot size 2 should give minutes 00 and 30.

const containerElement = document.getElementById("one-pane");
for (let i = 0; i < TOTAL_HOURS / HOURS_IN_SLOT; i++) {

	const hours = i < 10 ? "0" + i : i

	const slotElement = document.createElement("div");
	slotElement.setAttribute("id", `slot-${i}`);
	slotElement.setAttribute("class", "panel-title slot");
	slotElement.setAttribute("onClick", `javascript: onSlotClick(${i});`);
	slotElement.innerHTML = `<span style="flex:0.2; color: white;">${hours}:00</span><div class="border-line" id="border-line-${i}" ></div>`;
	containerElement.append(slotElement);
}