import { drawField } from "./main";
import { GAME_STATE } from "./game_state";
import { KIAR_ARK } from "./kiar_ark";

console.log("drawField #", 0);
drawField({ focus: null });
KIAR_ARK.header = [...KIAR_ARK.header, { type: "header", dat: `{始時:${(new Date()).toISOString()}}` }];

document.getElementById("kait_kaik_button")!.addEventListener("click", () => {
  document.getElementById("kait_kaik")!.classList.add("nocover");
  GAME_STATE.is_my_turn = JSON.parse(sessionStorage.is_first_move_my_move);
  KIAR_ARK.header = [...KIAR_ARK.header, { type: "header", dat: `{一位色:${GAME_STATE.is_my_turn === GAME_STATE.IA_is_down ? "黒" : "赤"}}` }];
});

export let KRUT_CRUOP: boolean = true; 
// toggles `sound/ciurl4.ogg` and `sound/thud.ogg`.

document.getElementById("krut_cruop_button")!.addEventListener("click", () => {
  KRUT_CRUOP = !KRUT_CRUOP;
  console.log("KRUT_CRUOP now set to", KRUT_CRUOP);
  (document.getElementById("krut_cruop_button")! as HTMLInputElement).src = KRUT_CRUOP ? "image/kut2_cuop2_active.png" : "image/kut2_cuop2_inactive.png";
});

export let LORK_LIAR: number = 50;
export let LORK_LIAR_ENABLED: boolean = true;
// toggles the music.

document.getElementById("lork_liar_button")!.addEventListener("click", () => {
  LORK_LIAR_ENABLED = !LORK_LIAR_ENABLED;
  (document.getElementById("lork_liar_button")! as HTMLInputElement).src = LORK_LIAR_ENABLED ? "image/lok1_lia1_active.png" : "image/lok1_lia1_inactive.png";
});

if (sessionStorage.vs === "cpu") {
  document.getElementById("larta_opponent_img")!.innerHTML = `<img src="image/nystiper2.png">`;
} else if (sessionStorage.vs === "someone") {
  document.getElementById("larta_opponent_img")!.innerHTML = `<img src="image/larta2.png">`;
} else {
  // Maybe you entered this page without registering. Go back to entrance.html.
  location.href = "entrance.html";
}

