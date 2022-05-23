cd .\Applications\

echo "Starting servers..."

Start-Job -FilePath {../Server.ps1} -Name "Server"

echo ""

echo "Clock starts in singelThreaded"

Measure-Command { node .\singleThreaded.js }

echo "Clock starts in multiProcesses"

Measure-Command { node .\multiProcesses.js }

echo "Clock starts in multiThreading"

Measure-Command { node .\multiThreading.js }

Stop-Job -Name "Server"

cd Songs

Remove-Item ./*.*

cd ../..