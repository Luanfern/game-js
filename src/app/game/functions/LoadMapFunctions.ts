class LoadMapFunctions {
    async loadJson(jsonFileName: string): Promise<any>{
        const response = await fetch(jsonFileName);
        const fileContent = await response.json();
        return fileContent
      }
}

export default LoadMapFunctions