import { drawField } from "./main";
import { GAME_STATE } from "./game_state";
import { KIAR_ARK } from "./kiar_ark";

console.log("drawField #", 0);
drawField({ focus: null });
KIAR_ARK.header = [...KIAR_ARK.header, (`{始時:${(new Date()).toISOString()}}`)];

document.getElementById("kait_kaik_button")!.addEventListener("click", () => {
  document.getElementById("kait_kaik")!.classList.add("nocover");
  GAME_STATE.is_my_turn = JSON.parse(sessionStorage.is_first_move_my_move);
  KIAR_ARK.header = [...KIAR_ARK.header, (`{一位色:${GAME_STATE.is_my_turn === GAME_STATE.IA_is_down ? "黒" : "赤"}}`)];
});

if (sessionStorage.vs === "cpu") {
  document.getElementById("larta_opponent_img")!.innerHTML = `<img src="image/nystiper2.png">`;
} else if (sessionStorage.vs === "someone") {
  document.getElementById("larta_opponent_img")!.innerHTML = `<img src="image/larta2.png">`;
} else {
  // Maybe you entered this page without registering. Go back to entrance.html.
  location.href = "entrance.html";
}

