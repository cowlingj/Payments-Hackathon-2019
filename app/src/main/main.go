package main

import(
	"fmt"
	"net/http"
	"os"
)



func main() {
	fmt.Println("starting")

	http.HandleFunc("/", home)
	http.HandleFunc("/home", home)
	http.HandleFunc("/success", success)
	http.HandleFunc("/failure", failure)

	fmt.Fprintln(os.Stderr, http.ListenAndServe(":9000", nil))
}
