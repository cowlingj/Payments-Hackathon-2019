package main

import(
	"fmt"
	"net/http"
	"os"
)



func main() {
	fmt.Println("starting")

	http.HandleFunc("/500", log(http500))
	http.HandleFunc("/404", log(http404))
	http.HandleFunc("/settings", log(staticFile("html/Settings.html")))
	http.HandleFunc("/key", log(resetKey))
	http.HandleFunc("/", log(staticFile("html/Home.html")))
	http.HandleFunc("/home", log(staticFile("html/Home.html")))
	http.HandleFunc("/success", log(staticFile("html/Success.html")))
	http.HandleFunc("/failure", log(staticFile("html/Failed.html")))
	http.HandleFunc("/failed", log(staticFile("html/Failed.html")))
	http.HandleFunc("/pay", log(pay))
	
	http.HandleFunc("/static/", log(static))

	fmt.Fprintln(os.Stderr, http.ListenAndServe(":9000", nil))
}
