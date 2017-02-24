# tic-tac-toe
Simple game of tic-tac-toe utilizing the minimax algorithm.

Play [here](https://wesleylhandy.github.io/tic-tac-toe/)

This game cannot be beaten by a human player. The minimax algoritm works through every possible end state in the game of tic-tac-toe and assigns a value to each move. The AI will choose the path that minimizes the users chances of winning while maximizing its own.

Since the number of possible leaf nodes for any given branch, though quite large, is finite, the AI knows every possible combination of plays and thus can choose the perfect path. The best possible scenario for a user is to also play perfectly and earn a draw.

According to http://www.se16.info/hgb/tictactoe.htm, the total number of leaf nodes for tic-tac-toe is 255,168, which is small change for a V8 Javascript Engine.

I researched the minimax algorithm extensively, and found the following tutorial the most helpful for building this particular project - https://github.com/Mostafa-Samir/Tic-Tac-Toe-AI

You will find that I have adapted much of this code, with minor modifications.

There are many other excellent resources on the minimax algorithm - the get the cleareast understand of what it does, in general, this lecture from MIT is most helpful - https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-034-artificial-intelligence-fall-2010/lecture-videos/lecture-6-search-games-minimax-and-alpha-beta/

Moreover, you are introduced to another algorithm which when built over the minimax alogrithm, reduces computing resources needed and enables this algorithm to be used in NP scenaries (think P vs NP). This aglorithm is the alpha-beta algorithm.

Implementing this algorithm is not necessary for tic-tac-toe, but this would be the next step in improving the current app, and working towards more difficult implementations, such as with chess.

Another improvement would be to enhance the ui, but for the current ui is sufficient for demonstrating the effectiveness of the algorithm.
