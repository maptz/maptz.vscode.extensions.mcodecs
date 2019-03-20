#https://docs.microsoft.com/en-us/dotnet/core/rid-catalog
$rootPath = Resolve-Path "$PSScriptRoot/../Maptz.MCodeCS.Tool.csproj"

Function CreateSession(){
    $ipAddress= & menv get StephenEllisVMIPAddress
    $username =& menv get StephenEllisVmUsername
    $passwd =& menv get StephenEllisVmPassword
    $secpasswd = ConvertTo-SecureString "$passwd" -AsPlainText -Force
    $mycreds = New-Object System.Management.Automation.PSCredential ($username, $secpasswd)
    $session = New-PSSession -ComputerName $ipAddress -Credential $mycreds -UseSSL
    
    return $session
}

#https://docs.microsoft.com/en-us/dotnet/core/rid-catalog
Function CreateZipFile($rid){
    $version = &mver get -i $rootPath
    $version = $version.Trim()
    Write-Host "Publishing version: $version with RID $rid."
    
    $win10Path = "$PSScriptRoot\..\bin\Release\netcoreapp2.1\$rid\publish"
    if (Test-Path $win10Path){
        Remove-Item $win10Path -Recurse -Force
    }
    & dotnet publish "$rootPath" --configuration Release --runtime $rid --self-contained | Write-Host
    if ($LASTEXITCODE -ne 0){
        Write-Error "Dotnet publish failed"
        exit
    }
        
    $zipFilesPath = "$PSScriptRoot\..\bin\exes"
    if (!(Test-Path $zipFilesPath)){
        New-Item $zipFilesPath -ItemType "Directory"
    }
    $win10ZipPath = "$zipFilesPath\Maptz.MCodeCS.Tool.$rid.$version.zip"
    Write-Host "Compressing files at '$win10Path' to '$win10ZipPath'"
    Compress-Archive  -Path "$win10Path\*" -Force -DestinationPath "$win10ZipPath"
    return $win10ZipPath
}

$ArrList = [System.Collections.ArrayList]@()
$zipFilePath = CreateZipFile "win10-x64"
$ArrList.Add($zipFilePath)
$zipFilePath = CreateZipFile "win10-x86"
$ArrList.Add($zipFilePath)
$zipFilePath = CreateZipFile "linux-x64"
$ArrList.Add($zipFilePath)
$zipFilePath = CreateZipFile "osx-x64"
$ArrList.Add($zipFilePath)

$TargetSession = CreateSession
foreach($fi in $ArrList){
    Write-Host "Copying '$fi' to remote computer."
    Copy-Item -ToSession $TargetSession -Path "$fi" -Destination "C:\sites\data\downloads\" -Recurse -Force  -Verbose
}
Remove-PSSession -Session $TargetSession


