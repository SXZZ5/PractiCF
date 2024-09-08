- Fetch ya Shuffle click hone pe
  - Check validity of lowerbound and upperbound ranges.
  - Update a stateVariable which inturn triggers API call.
  
- Everytime the API call is completed succesfully we do some processing on the response object to narrow down to a smaller array of problems. 
- Let this problem array also be a state variable so that everytime it updates, react re-renders the problems card.

- current progress:
  - cf rating wise filtering via api nahi deta hai. To tumko pura problemset hi leke usko filter karna padega client side code me.
  - ek issue aarha hai ki asynchronously fetch to kar liya hai pura problemset par usko filtering logic ko pass kaise karu ? Filtering logic also has to wait for problesmset ka promise to be resolved waise to. _Not really an issue, but a design choice that I have to make soch samajh ke._
