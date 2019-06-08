package main

import(
	"fmt"
	"net/http"
	"os"
)

func home(res http.ResponseWriter, req *http.Request){
	res.Write([]byte("hello world"))
}

func main() {
	fmt.Println("starting")

	http.HandleFunc("/", home)
	http.HandleFunc("/home", home)

	fmt.Fprintln(os.Stderr, http.ListenAndServe(":9000", nil))
}