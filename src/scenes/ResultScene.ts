import { GOOD_COLOR, SESSION_ID } from "../Main";

export default class ResultScene extends Phaser.Scene {
    doneButton!: Phaser.GameObjects.Rectangle;
    userOneWordGroup!: Phaser.GameObjects.Group;
    userTwoWordGroup!: Phaser.GameObjects.Group;

    constructor() {
        super({ key: "result", active: false });
    }

    async create() {
        this.time.addEvent({
            delay: 3 * 1000,
            callback: this.setSessionInfo,
            callbackScope: this,
            loop: true,
            startAt: 1.5 * 1000,
        });

        this.userOneWordGroup = this.add.group();
        this.userTwoWordGroup = this.add.group();

        this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            this.cameras.main.width,
            this.cameras.main.height,
            0xffffff,
            Math.floor(255 * 0.2)
        );

        this.add
            .text(
                this.cameras.main.centerX,
                this.cameras.main.centerY,
                "You're done.",
                {
                    color: "black",
                    fontSize: "10vh",
                }
            )
            .setOrigin(0.5);

        const buttonContainer = this.add.container(
            this.cameras.main.centerX,
            Math.floor(this.cameras.main.height * 0.75)
        );
        buttonContainer.add(
            this.add
                .rectangle(
                    0,
                    0,
                    this.cameras.main.width * 0.3,
                    this.cameras.main.height * 0.1,
                    GOOD_COLOR
                )
                .setInteractive()
                .on("pointerdown", this.doneButtonHandler, this)
        );
        buttonContainer.add(
            this.add
                .text(0, 0, "Exit", {
                    fontSize: `${this.cameras.main.height * 0.07}px`,
                    color: "black",
                })
                .setOrigin(0.5)
        );
    }

    doneButtonHandler() {
        // TODO: Exit the webpage
    }

    async setSessionInfo() {
        const res = await fetch(
            `http://localhost:3000/who/session/${SESSION_ID}`,
            {
                method: "GET",
            }
        );
        const session: SessionView = await res.json();

        const addAndAlignWords = (
            textGroup: Phaser.GameObjects.Group,
            xOffset: number,
            wordList?: string[]
        ) => {
            textGroup.clear(true, true);

            if (wordList) {
                for (const word of wordList) {
                    textGroup.add(
                        this.add.text(0, 0, word, { color: "black" })
                    );
                }

                Phaser.Actions.GridAlign(textGroup.getChildren(), {
                    width: 1,
                    height: textGroup.getLength(),
                    cellWidth: 32,
                    cellHeight: 32,
                    x: xOffset,
                    y: 100,
                });
            }
        };

        const userOneWords =
            session.scores[Object.keys(session.scores)[0]].words;
        addAndAlignWords(this.userOneWordGroup, 100, userOneWords);

        const userTwoWords =
            session.scores[Object.keys(session.scores)[1]].words;
        addAndAlignWords(this.userTwoWordGroup, 500, userTwoWords);
    }
}