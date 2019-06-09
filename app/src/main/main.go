package main

import(
	"fmt"
	"net/http"
	"os"
)



func main() {
	fmt.Println("starting")

	http.HandleFunc("/", log(home))
	http.HandleFunc("/home", log(home))
	http.HandleFunc("/success", log(success))
	http.HandleFunc("/failure", log(failure))
	
	http.HandleFunc("/static/", log(static))

	fmt.Fprintln(os.Stderr, http.ListenAndServe(":9000", nil))
}
