package main

import(
	"fmt"
	"net/http"
	"os"
	"io/ioutil"
)

func home(res http.ResponseWriter, req *http.Request){
	body, err := ioutil.ReadFile("src/static/Home.htm")
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		return
	}
	res.Write(body)
}

func success(res http.ResponseWriter, req *http.Request){
	body, err := ioutil.ReadFile("src/static/Success.html")
	if err != nil {
	 fmt.Fprintln(os.Stderr, err)
	 return
	}
	res.Write(body)
}

func failure(res http.ResponseWriter, req *http.Request){
	body, err := ioutil.ReadFile("src/static/Failed.html")
	if err != nil {
	 fmt.Fprintln(os.Stderr, err)
	 return
	}
	res.Write(body)
}
