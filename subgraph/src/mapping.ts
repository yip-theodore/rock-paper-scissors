import { near, BigInt, json, log } from "@graphprotocol/graph-ts"
import { Player, Game } from "../generated/schema"

export function handleReceipt(receipt: near.ReceiptWithOutcome): void {
  const actions = receipt.receipt.actions
  for (let i = 0; i < actions.length; i++) {
    // log.debug("action {} {}", [i.toString(), actions[i].kind.toString()])
    handleAction(actions[i], receipt.receipt, receipt.block.header, receipt.outcome)
  }
}

function handleAction(
  action: near.ActionValue,
  receipt: near.ActionReceipt,
  blockHeader: near.BlockHeader,
  outcome: near.ExecutionOutcome,
): void {
  if (action.kind != near.ActionKind.FUNCTION_CALL) {
    log.info("Early return: {}", ["Not a function call"])
    return
  }
  const functionCall = action.toFunctionCall()
  if (functionCall.methodName == "play") {
    let player = Player.load(receipt.signerId)
    if (player == null) {
      player = new Player(receipt.signerId)
      player.save()
    }
    const game = new Game(receipt.id.toBase58())
    const input = json.fromBytes(functionCall.args).toObject()
    const output = outcome.status.toValue().toString()
    game.from = player.id
    game.timestamp = BigInt.fromU64(blockHeader.timestampNanosec)
    game.played = input.mustGet('p').toBigInt().toU32()
    game.result = output.includes('tie') ? 'tie' : output.includes('won') ? 'win' : 'loss'
    game.bet = functionCall.deposit
    game.save()
  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName])
  }
}
