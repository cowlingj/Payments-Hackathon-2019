package main

import(
	"fmt"
	"net/http"
	"os"
)

func main() {
	fmt.Println("starting")

	http.HandleFunc("/", func(res http.ResponseWriter, req *http.Request){
		res.Write([]byte("hello world"))
	})

	fmt.Fprintln(os.Stderr, http.ListenAndServe(":9000", nil))
}