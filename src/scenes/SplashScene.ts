import eventsCenter, { WHOEvents } from "../WHOEvents";

export default class SplashScene extends Phaser.Scene {
    boardDone = false;
    badButtonColor = 0xff0000;
    goodButtonColor = 0x00ff00;

    overlayButton!: Phaser.GameObjects.Rectangle;
    overlayGroup!: Phaser.GameObjects.Group;

    constructor() {
        super({ key: "splash" });
    }

    create() {
        eventsCenter.on(WHOEvents.BoardDone, this.boardDoneHandler, this);

        this.overlayGroup = this.add.group();
        this.overlayGroup.add(
            this.add.rectangle(
                this.cameras.main.centerX,
                this.cameras.main.centerY,
                this.cameras.main.width,
                this.cameras.main.height,
                0xffffff,
                Math.floor(255 * 0.2)
            )
        );
        this.overlayButton = this.add
            .rectangle(
                this.cameras.main.centerX,
                Math.floor(this.cameras.main.height * 0.75),
                this.cameras.main.width * 0.3,
                this.cameras.main.height * 0.1,
                this.badButtonColor
            )
            .on("pointerdown", this.startButtonHandler, this);
        this.overlayGroup.add(this.overlayButton);
        this.overlayGroup.setDepth(100);

        this.scene.launch("board");
    }

    startButtonHandler() {
        eventsCenter.emit(WHOEvents.GameStart);
        this.scene.stop();
    }

    boardDoneHandler() {
        if (this.overlayGroup) {
            this.overlayGroup
                .getChildren()
                .forEach((child) => child.setInteractive());
        }
        if (this.overlayButton) {
            this.overlayButton.fillColor = this.goodButtonColor;
        }
        this.boardDone = true;
    }
}
