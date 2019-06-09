package main

import(
	"fmt"
	"net/http"
	"os"
	"io/ioutil"
	"regexp"
	"path/filepath"
)

func home(res http.ResponseWriter, req *http.Request){
	body, err := ioutil.ReadFile("src/static/Home.html")
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		http500(res, req)
		return
	}
	res.Write(body)
}

func success(res http.ResponseWriter, req *http.Request){
	body, err := ioutil.ReadFile("src/static/Success.html")
	if err != nil {
	 fmt.Fprintln(os.Stderr, err)
	 http500(res, req)
	 return
	}
	res.Write(body)
}

func failure(res http.ResponseWriter, req *http.Request){
	body, err := ioutil.ReadFile("src/static/Failed.html")
	if err != nil {
	 fmt.Fprintln(os.Stderr, err)
	 http500(res, req)
	 return
	}
	res.Write(body)
}

var staticRegex = regexp.MustCompile("^/static/(.+)")

func static(res http.ResponseWriter, req *http.Request) {
	var match = staticRegex.FindSubmatch([]byte(filepath.Clean(req.URL.Path)))

	if (len(match) != 2) {
		http404(res, req)
		return
	}

	var path = string(match[1])
	if (path == "") {
		http404(res, req)
		return
	}

	body, err := ioutil.ReadFile("src/static/" + path)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		http500(res, req)
		return
	}
	res.Write(body)
}

func http404(res http.ResponseWriter, req *http.Request) {
	http.Error(res, "This is not the page you are looking for", http.StatusNotFound)
}

func http500(res http.ResponseWriter, req *http.Request) {
	http.Error(res, "Oops! something went wrong", http.StatusInternalServerError)
}
