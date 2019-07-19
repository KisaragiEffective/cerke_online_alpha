const BOX_SIZE = 70;
const MAX_PIECE_SIZE = BOX_SIZE - 1;
const PIECE_SIZE = 60;

function createPieceSizeImageOnBoardByPathAndXY(top: number, left: number, path: string, className: string): HTMLImageElement {
    let i = document.createElement("img");
    i.classList.add(className);
    i.style.top = `${top}px`;
    i.style.left = `${left}px`;
    i.src = `image/${path}.png`;
    i.width = PIECE_SIZE;
    i.height = PIECE_SIZE;
    return i;
}

function createPieceSizeImageOnBoardByPath(coord: Coord, path: string, className: string): HTMLImageElement {
    let [row_index, column_index] = coord;
    return createPieceSizeImageOnBoardByPathAndXY(
        1 + row_index * BOX_SIZE + (MAX_PIECE_SIZE - PIECE_SIZE) / 2,
        1 + column_index * BOX_SIZE + (MAX_PIECE_SIZE - PIECE_SIZE) / 2,
        path,
        className
    );
}

function createPieceSizeImageOnBoardByPath_Shifted(coord: readonly [number, number], path: string, className: string): HTMLImageElement {
    let [row_index, column_index] = coord;
    return createPieceSizeImageOnBoardByPathAndXY(
        1 + row_index * BOX_SIZE + (MAX_PIECE_SIZE - PIECE_SIZE),
        1 + column_index * BOX_SIZE,
        path,
        className
    );
}

type Hop1Zuo1 = NonTam2Piece[];

type Field = {
    currentBoard: Board,
    hop1zuo1OfUpward: NonTam2PieceUpward[],
    hop1zuo1OfDownward: NonTam2PieceDownward[],
}

type GAME_STATE = {
    f: Field,
    IA_is_down: boolean,
    tam_itself_is_tam_hue: boolean,
    backupDuringStepping: null | [Coord, Piece]
};

let GAME_STATE: GAME_STATE = {
    f: {
        currentBoard: [
            [null, null, null, null, null, null, null, null, "Tam2"],
            [null, null, null, null, null, null, null, null, "Tam2"],
            [null, null, null, null, null, null, null, null, "Tam2"],
            [null, null, null, null, null, null, null, null, "Tam2"],
            [null, null, null, null, null, null, null, null, "Tam2"],
            [null, null, null, null, null, null, null, null, "Tam2"],
            [null, null, null, null, null, null, null, null, "Tam2"],
            [null, null, null, null, null, null, null, null, "Tam2"],
            [null, null, null, null, null, null, null, null, "Tam2"]
        ] as Board,
        hop1zuo1OfDownward: [],
        hop1zuo1OfUpward: [],
    },
    IA_is_down: true,
    tam_itself_is_tam_hue: true,
    backupDuringStepping: null
}

type UI_STATE = {
    selectedCoord: null | Coord | ["Hop1zuo1", number];
};

let UI_STATE: UI_STATE = {
    selectedCoord: null
};

function eraseGuide(): void {
    removeChildren(document.getElementById("contains_guides")!);
    removeChildren(document.getElementById("contains_guides_on_upward")!);
}

function toAbsoluteCoord([row, col]: Coord): AbsoluteCoord {
    return [
        [
            AbsoluteRow.A, AbsoluteRow.E, AbsoluteRow.I,
            AbsoluteRow.U, AbsoluteRow.O, AbsoluteRow.Y,
            AbsoluteRow.AI, AbsoluteRow.AU, AbsoluteRow.IA
        ][GAME_STATE.IA_is_down ? row : 8 - row],
        [
            AbsoluteColumn.K, AbsoluteColumn.L, AbsoluteColumn.N,
            AbsoluteColumn.T, AbsoluteColumn.Z, AbsoluteColumn.X,
            AbsoluteColumn.C, AbsoluteColumn.M, AbsoluteColumn.P
        ][GAME_STATE.IA_is_down ? col : 8 - col]
    ];
}

function getThingsGoingFromHop1zuo1(ev: MouseEvent, piece: Piece, from: ["Hop1zuo1", number], to: Coord) {
    let dest = GAME_STATE.f.currentBoard[to[0]][to[1]];

    // must parachute onto an empty square
    if (dest != null) {
        alert("Cannot parachute onto an occupied square");
        throw new Error("Cannot parachute onto an occupied square");
    }

    if (piece === "Tam2") {
        alert("Cannot parachute Tam2");
        throw new Error("Cannot parachute Tam2");
    }

    let abs_dst: AbsoluteCoord = toAbsoluteCoord(to);
    let message: NormalNonTamMove = {
        type: "NonTamMove",
        data: {
            type: "FromHand",
            color: piece.color,
            prof: piece.prof,
            dest: abs_dst
        }
    };

    console.log("sending normal move:", JSON.stringify(message));

    eraseGuide();
    UI_STATE.selectedCoord = null;

    alert("message sent.");
    return;
}

function erasePhantom() {
    let contains_phantom = document.getElementById("contains_phantom")!;
    while (contains_phantom.firstChild) {
        contains_phantom.removeChild(contains_phantom.firstChild);
    }
}

function stepping(from: Coord, piece: Piece, to: Coord, destPiece: Piece) {
    eraseGuide();
    document.getElementById("protective_cover_over_field")!.classList.remove("nocover");

    // delete the original one
    GAME_STATE.backupDuringStepping = [from, piece];
    GAME_STATE.f.currentBoard[from[0]][from[1]] = null;

    // draw
    drawField(GAME_STATE.f);

    const drawPhantomAt = function (coord: Coord, piece: Piece) {
        let contains_phantom = document.getElementById("contains_phantom")!;
        erasePhantom();

        const phantom: HTMLImageElement = createPieceImgToBePlacedOnBoard(coord, piece);
        phantom.style.opacity = "0.1";
        contains_phantom.appendChild(phantom);
    }

    const drawCancel = function () {
        let contains_phantom = document.getElementById("contains_phantom")!;

        let cancelButton = createPieceSizeImageOnBoardByPath_Shifted([9, 7.5], "piece/bmun", "piece_image_on_board");
        cancelButton.width = 80;
        cancelButton.height = 80;

        cancelButton.style.zIndex = "100";
        cancelButton.style.cursor = "pointer";

        cancelButton.addEventListener('click', function (ev) {
            eraseGuide();
            erasePhantom();
            document.getElementById("protective_cover_over_field")!.classList.add("nocover");

            // resurrect the original one
            const backup: [Coord, Piece] = GAME_STATE.backupDuringStepping!;
            const from: Coord = backup[0];
            GAME_STATE.f.currentBoard[from[0]][from[1]] = backup[1];
            GAME_STATE.backupDuringStepping = null;

            UI_STATE.selectedCoord = null;

            // draw
            drawField(GAME_STATE.f);
        });
        contains_phantom.appendChild(cancelButton);
    }

    const drawHoverAt = function (coord: Coord, piece: Piece) {
        let contains_phantom = document.getElementById("contains_phantom")!;

        let img = createPieceSizeImageOnBoardByPath_Shifted(
            coord,
            toPath_(piece),
            "piece_image_on_board"
        );

        img.style.zIndex = "100";
        img.style.cursor = "pointer";

        const selectHover = function () {
            const contains_guides = document.getElementById("contains_guides")!;

            let centralNode = createPieceSizeImageOnBoardByPath_Shifted(coord, "selection2", "selection");

            centralNode.style.cursor = "pointer";

            // click on it to erase
            centralNode.addEventListener('click', function () {
                eraseGuide();
                UI_STATE.selectedCoord = null;
            });

            centralNode.style.zIndex = "200";
            contains_guides.appendChild(centralNode);

            const { finite: guideListYellow, infinite: guideListGreen } = calculateMovablePositions(
                coord,
                piece,
                GAME_STATE.f.currentBoard,
                GAME_STATE.tam_itself_is_tam_hue);

            display_guide_after_stepping(coord, piece, contains_guides, guideListYellow, "ct");

            display_guide_after_stepping(coord, piece, contains_guides, guideListGreen, "ct2");
        }

        img.addEventListener('click', selectHover);
        contains_phantom.appendChild(img);

        // draw as already selected
        selectHover();
    }

    drawPhantomAt(from, piece);
    drawCancel();
    drawHoverAt(to, piece);
}

function getThingsGoing(ev: MouseEvent, piece: Piece, from: Coord, to: Coord) {
    let destPiece: "Tam2" | null | NonTam2Piece = GAME_STATE.f.currentBoard[to[0]][to[1]];

    if (destPiece == null) { // dest is empty square; try to simply move

        let message: NormalMove;

        if (piece !== "Tam2") {
            let abs_src: AbsoluteCoord = toAbsoluteCoord(from);
            let abs_dst: AbsoluteCoord = toAbsoluteCoord(to);
            message = {
                type: "NonTamMove",
                data: {
                    type: "SrcDst",
                    src: abs_src,
                    dest: abs_dst
                }
            };
            console.log("sending normal move:", JSON.stringify(message));

            eraseGuide();
            UI_STATE.selectedCoord = null;

            alert("message sent.");
            return;
        } else {
            alert("implement Tam2 movement");
            return;
        }
    }

    if (destPiece === "Tam2" || destPiece.side === Side.Upward || piece === "Tam2") { // can step, but cannot take
        stepping(from, piece, to, destPiece);
        return;
    }

    if (confirm(DICTIONARY.ja.whetherToTake)) {
        let abs_src: AbsoluteCoord = toAbsoluteCoord(from);
        let abs_dst: AbsoluteCoord = toAbsoluteCoord(to);
        let message: NormalNonTamMove = {
            type: "NonTamMove",
            data: {
                type: "SrcDst",
                src: abs_src,
                dest: abs_dst
            }
        }

        console.log("sending normal move:", JSON.stringify(message));

        eraseGuide();
        UI_STATE.selectedCoord = null;

        alert("message sent.");
        return;
    } else {
        stepping(from, piece, to, destPiece);
        return;
    }
}

function createCircleGuideImageAt(coord: Coord, path: string) {
    const [row_index, column_index] = coord;
    let img = document.createElement("img");
    img.classList.add("guide");
    img.style.top = `${1 + row_index * BOX_SIZE + (MAX_PIECE_SIZE - MAX_PIECE_SIZE) / 2}px`;
    img.style.left = `${1 + column_index * BOX_SIZE + (MAX_PIECE_SIZE - MAX_PIECE_SIZE) / 2}px`;
    img.src = `image/${path}.png`;
    img.width = MAX_PIECE_SIZE;
    img.height = MAX_PIECE_SIZE;
    img.style.cursor = "pointer";
    img.style.opacity = "0.3";
    return img;
}

function display_guide_after_stepping(coord: Coord, piece: Piece, parent: HTMLElement, list: Array<Coord>, path: string) {
    for (let ind = 0; ind < list.length; ind++) {
        let img = createCircleGuideImageAt(list[ind], path);

        // FIXME: implement me
        img.addEventListener('click', function (ev) {
            alert("foo");
        });

        img.style.zIndex = "200";
        parent.appendChild(img);
    }
}

function display_guide(coord: Coord, piece: Piece, parent: HTMLElement, list: Array<Coord>) {
    for (let ind = 0; ind < list.length; ind++) {
        // draw the yellow guides
        let img = createCircleGuideImageAt(list[ind], "ct");

        // click on it to get things going
        img.addEventListener('click', function (ev) {
            getThingsGoing(ev, piece, coord, list[ind]);

        });

        parent.appendChild(img);
    }
}

function selectOwnPieceOnBoard(coord: Coord, piece: Piece, imgNode: HTMLImageElement) {
    /* erase the guide in all cases, since the guide also contains the selectedness of Hop1zuo1 */
    eraseGuide();

    if (UI_STATE.selectedCoord == null || UI_STATE.selectedCoord[0] === "Hop1zuo1" || !coordEq(UI_STATE.selectedCoord, coord)) {
        UI_STATE.selectedCoord = coord;

        const contains_guides = document.getElementById("contains_guides")!;

        let centralNode = createPieceSizeImageOnBoardByPath(coord, "selection2", "selection");
        centralNode.style.cursor = "pointer";

        // click on it to erase
        centralNode.addEventListener('click', function () {
            eraseGuide();
            UI_STATE.selectedCoord = null;
        });

        contains_guides.appendChild(centralNode);

        const { finite: guideListFinite, infinite: guideListInfinite } = calculateMovablePositions(
            coord,
            piece,
            GAME_STATE.f.currentBoard,
            GAME_STATE.tam_itself_is_tam_hue);

        display_guide(coord, piece, contains_guides, [...guideListFinite, ...guideListInfinite]);

    } else {
        /* Clicking what was originally selected will make it deselect */
        UI_STATE.selectedCoord = null;
    }
}

function selectOwnPieceOnHop1zuo1(ind: number, piece: Piece, imgNode: HTMLImageElement) {
    // erase the existing guide in all circumstances
    eraseGuide();

    if (UI_STATE.selectedCoord == null || UI_STATE.selectedCoord[0] !== "Hop1zuo1" || UI_STATE.selectedCoord[1] !== ind) {

        UI_STATE.selectedCoord = ["Hop1zuo1", ind];

        const contains_guides_on_upward = document.getElementById("contains_guides_on_upward")!;
        let centralNode = createPieceSizeImageOnBoardByPathAndXY(
            1 + (MAX_PIECE_SIZE - PIECE_SIZE) / 2,
            1 + ind * BOX_SIZE + (MAX_PIECE_SIZE - PIECE_SIZE) / 2,
            "selection2",
            "selection"
        );

        centralNode.style.cursor = "pointer";

        // click on it to erase
        centralNode.addEventListener('click', function () {
            eraseGuide();
            UI_STATE.selectedCoord = null;
        });
        contains_guides_on_upward.appendChild(centralNode);

        const contains_guides = document.getElementById("contains_guides")!;
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                let ij: Coord = [i as BoardIndex, j as BoardIndex];

                // skip if already occupied
                if (GAME_STATE.f.currentBoard[i][j] != null) {
                    continue;
                }

                // draw the yellow guides
                let img = createCircleGuideImageAt(ij, "ct");

                // click on it to get things going
                img.addEventListener('click', function (ev) {
                    getThingsGoingFromHop1zuo1(ev, piece, ["Hop1zuo1", ind], ij);
                });

                contains_guides.appendChild(img);
            }
        }
    } else {
        /* re-click: deselect */
        UI_STATE.selectedCoord = null;
    }
}

function createPieceImgToBePlacedOnHop1zuo1(ind: number, path: string): HTMLImageElement {
    return createPieceSizeImageOnBoardByPathAndXY(
        1 + (MAX_PIECE_SIZE - PIECE_SIZE) / 2,
        1 + ind * BOX_SIZE + (MAX_PIECE_SIZE - PIECE_SIZE) / 2,
        path,
        "piece_image_on_hop1zuo1"
    );
}

function createPieceImgToBePlacedOnBoard(coord: Coord, piece: Piece) {
    return createPieceSizeImageOnBoardByPath(coord, toPath_(piece), "piece_image_on_board");
}

function removeChildren(parent: HTMLElement) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function drawField(field: Field) {
    const drawBoard = function (board: Board) {
        const contains_pieces_on_board = document.getElementById("contains_pieces_on_board")!;
        GAME_STATE.f.currentBoard = board;

        // delete everything
        removeChildren(contains_pieces_on_board);

        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                const piece: Piece | null = board[i][j];
                if (piece == null) {
                    continue;
                }

                const coord: Coord = [i as BoardIndex, j as BoardIndex];
                let imgNode: HTMLImageElement = createPieceImgToBePlacedOnBoard(coord, piece);

                const selectable = (piece === "Tam2") ? true : (piece.side === Side.Upward);

                if (selectable) {
                    imgNode.style.cursor = "pointer";
                    imgNode.addEventListener('click', function () {
                        selectOwnPieceOnBoard(coord, piece, imgNode)
                    });
                }

                contains_pieces_on_board.appendChild(imgNode);
            }
        }
    }

    const drawHop1zuo1OfUpward = function (list: NonTam2PieceUpward[]) {
        const contains_pieces_on_upward = document.getElementById("contains_pieces_on_upward")!;
        GAME_STATE.f.hop1zuo1OfUpward = list;

        // delete everything
        removeChildren(contains_pieces_on_upward);

        for (let i = 0; i < list.length; i++) {
            const piece: NonTam2PieceUpward = list[i];
            let imgNode = createPieceImgToBePlacedOnHop1zuo1(i, toPath(piece));

            imgNode.style.cursor = "pointer";
            imgNode.addEventListener('click', function () {
                selectOwnPieceOnHop1zuo1(i, piece, imgNode)
            });

            contains_pieces_on_upward.appendChild(imgNode);
        }
    }

    const drawHop1zuo1OfDownward = function (list: NonTam2PieceDownward[]) {
        const contains_pieces_on_downward = document.getElementById("contains_pieces_on_downward")!;
        GAME_STATE.f.hop1zuo1OfDownward = list;

        // delete everything
        removeChildren(contains_pieces_on_downward);

        for (let i = 0; i < list.length; i++) {
            const piece: NonTam2PieceDownward = list[i];
            let imgNode = createPieceImgToBePlacedOnHop1zuo1(i, toPath(piece));
            contains_pieces_on_downward.appendChild(imgNode);
        }
    }

    drawBoard(field.currentBoard);
    drawHop1zuo1OfUpward(field.hop1zuo1OfUpward);
    drawHop1zuo1OfDownward(field.hop1zuo1OfDownward);
}
