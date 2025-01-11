## SPIN TEST

Just a quick implementation of a reel spin for fun.

Check it out here https://patrick-hammond.github.io/spin-test/dist/

At first, I tried moving the symbol sprites rather the the whole reel but even after accounting for excess overrun, they would eventually drift in relative position.  

I wanted to copy the original spin design from https://slotcatalog.com/en/slots/egyptian-marvel where the symbol position remain static as the reel spins.  

I achieved this by moving the symbol's parent container and when it has moved more than a symbol height distance, reset it back to the start and cascade all the symbol textures down.  

Lowering the **Constants.maxReelSpeed** value results in more traditional spinning.
