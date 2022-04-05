export enum Command {
    //Server -> Client
    ASSIGN_PLAYER = "ASSIGN_PLAYER", //Parameter: "player" = Player - the player you got assigned

    CURRENT_PLAYERS = "CURRENT_PLAYERS", //Paramter: "players" = List<Player> - all other players currently in the game

    PLAYER_JOINED = "PLAYER_JOINED", //Parameter: "player" = Player - the newly joined Player

    PLAYER_LEFT = "PLAYER_LEFT", //Paramter: "playerId" = string - the disconnected playerId

    NEXT_ROUND = "NEXT_ROUND", //Parameters: "url" = string - The url to show, "timer" = int - ms until next difficulty reduction, "type" = Type - type of the next word, "round" = int - the current round number

    WORD_SOLUTION = "WORD_SOLUTION", //Parameters: "solution" = string - solution to the current word, "timer" = int - ms until next word / game end
  
    NEXT_LEVEL = "NEXT_LEVEL", //Parameters: "url" = string - The url to show, "timer" = int - ms until next level or round

    GUESSED_WRONG = "GUESSED_WRONG", //Paramter: "playerId" = string - the playerId who guessed wrong, "guess" = string - the players guess

    GUESSED_CORRECT = "GUESSED_CORRECT", //Paramter: "playerId" = string - the playerId who guessed correctly, "points" = int - the new points of the player
    
    TOTAL_ROUNDS = "TOTAL_ROUNDS", //Paramters: "rounds" = int - the total number of rounds in this game
   
    GAME_END = "GAME_END", //No Paramters - Notification that the game has ended


    //Client -> Server
    START_GAME = "START_GAME", //No Paramters - Request to start a game

    I_GUESS = "I_GUESS", //Parameter: "guess" = string - the guess of the sender
}
