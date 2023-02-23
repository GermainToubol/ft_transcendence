import type { ballInterface } from './interfaces/ball.interface'
import type { paddleInterface } from './interfaces/paddle.interface'
import type { playGroundInterface } from './interfaces/playground.interface'

export default {
  getFactors: function (servWidth: number, servHeight: number, playgroundWidth: number, playgroundHeight: number): { v: number, h: number } {
    return ({ v: servWidth / playgroundWidth, h: servHeight / playgroundHeight })
  },

  drawPlayground: function (context: CanvasRenderingContext2D, playgroundWidth: number, playgroundHeight: number, color: string) {
    context.fillStyle = color
    context.fillRect(0, 0, playgroundWidth, playgroundHeight)
  },

  drawBall: function (context: CanvasRenderingContext2D, ball: ballInterface, playground: playGroundInterface, playgroundWidth: number, playgroundHeight: number) {
    const facts = this.getFactors(playground.width, playground.height, playgroundWidth, playgroundHeight)
    context.fillStyle = ball.color
    context.beginPath()
    context.arc(ball.x / facts.v, ball.y / facts.h, ball.radius / facts.v, 0, Math.PI * 2)
    context.closePath()
    context.fill()
  },

  drawPaddle: function (context: CanvasRenderingContext2D, paddle: paddleInterface, playground: playGroundInterface, playgroundWidth: number, playgroundHeight: number) {
    const facts = this.getFactors(playground.width, playground.height, playgroundWidth, playgroundHeight)
    context.fillStyle = paddle.color
    context.fillRect(paddle.x / facts.v, paddle.y / facts.h, paddle.width / facts.v, paddle.height / facts.h)
  },

  drawNet (context: CanvasRenderingContext2D, playgroundWidth: number, playgroundHeight: number, color: string) {
    const net = {
      x: playgroundWidth / 2 - 1,
      y: 0,
      width: 3,
      height: 15,
      color: color
    }
    for (let i = 0; i <= playgroundHeight; i += 26) {
      context.fillStyle = net.color
      context.fillRect(net.x, net.y + i, net.width, net.height)
    }
  },

  drawText: function (context: CanvasRenderingContext2D, text: string, x: number, y: number, width: number, color: string) {
    context.fillStyle = color
    context.font = (width / 20) + 'px Arial'
    context.textAlign = 'center'
    context.fillText(text, x, y)
  },

  clearContext: function (context: CanvasRenderingContext2D, playgroundWidth: number, playgroundHeight: number) {
    context.clearRect(0, 0, playgroundWidth, playgroundHeight)
  },

  updatePlayground: function (playground: playGroundInterface, context: CanvasRenderingContext2D, playgroundWidth: number, playgroundHeight: number, player1: string, player2: string) {
    this.clearContext(context, playgroundWidth, playgroundHeight)
    this.drawPlayground(context, playgroundWidth, playgroundHeight, playground.color)
    this.drawText(
      context,
      playground.score.playerOneScore.toString(),
      playgroundWidth / 4, playgroundHeight / 5, playgroundWidth,
      (playground.ball as ballInterface).color
    )
    this.drawText(
      context,
      playground.score.playerTwoScore.toString(),
      (playgroundWidth * 3) / 4, playgroundHeight / 5,
      playgroundWidth, (playground.ball as ballInterface).color
    )
    this.drawNet(context, playgroundWidth, playgroundHeight, (playground.ball as ballInterface).color)
    this.drawBall(context, playground.ball as ballInterface, playground, playgroundWidth, playgroundHeight)
    this.drawPaddle(context, playground.leftPaddle as paddleInterface, playground, playgroundWidth, playgroundHeight)
    this.drawPaddle(context, playground.rightPaddle as paddleInterface, playground, playgroundWidth, playgroundHeight)
    this.drawText(context, player1, playgroundWidth / 4, playgroundHeight / 9, playgroundWidth, (playground.ball as ballInterface).color)
    this.drawText(context, player2, (playgroundWidth * 3) / 4, playgroundHeight / 9, playgroundWidth, (playground.ball as ballInterface).color)
  }
}
