cd .\Applications\

echo "Starting server..."

Start-Job -FilePath {../Server.ps1} -Name "Server"

echo "Clock starts in singelThread"

Measure-Command { node .\singleThreaded.js }

echo "Clock starts in multiProcesses"

Measure-Command { node .\multiProcesses.js }

Stop-Job -Name "Server"

cd ..