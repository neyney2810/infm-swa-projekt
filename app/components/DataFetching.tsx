'use client'

import { useEffect, useState } from "react"

export default function DataFetching() {
    const [data, setData] = useState(null)
    useEffect(() => {
        fetch("/Parser")
    .then(response => response.json())
        // 4. Setting *dogImage* to the image url that we received from the response above
    .then(data => setData(data.message))
    }, [])
    return <>{JSON.stringify(data)}</>
}