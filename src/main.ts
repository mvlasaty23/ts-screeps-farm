import { GameManager } from './game-manager';

GameManager.globalBootstrap();

export const loop = function() {
	GameManager.loop();
}
