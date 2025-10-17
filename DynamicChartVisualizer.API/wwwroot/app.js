let fetchedData = [];
let chartCount = 1;

$("#btnFetch").click(function () {
    const connStr = $("#connectionString").val();
    const spName = $("#spName").val();

    if (!connStr || !spName) {
        alert("Bağlantı bilgisi ve SP adı zorunludur!");
        return;
    }

    $.ajax({
        url: "/api/data/execute-sp",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            connectionString: connStr,
            storedProcedureName: spName
        }),
        success: function (data) {
            if (!data || data.length === 0) {
                alert("Veri bulunamadı!");
                return;
            }

            fetchedData = data;

            const keys = Object.keys(data[0]);
            $("#xField, #yField").empty();
            keys.forEach(k => {
                $("#xField").append(`<option value="${k}">${k}</option>`);
                $("#yField").append(`<option value="${k}">${k}</option>`);
            });

            // 🔹 Veri tablosu oluştur
            const tableHead = keys.map(k => `<th>${k}</th>`).join("");
            const tableRows = data.map(row => {
                return `<tr>${keys.map(k => `<td>${row[k]}</td>`).join("")}</tr>`;
            }).join("");
            $("#dataPreview").html(`<thead><tr>${tableHead}</tr></thead><tbody>${tableRows}</tbody>`);
            $("#tableContainer").show();

            $("#mappingArea").show();

            // 🔹 Tablo satırına tıklayınca otomatik alan seçimi
            $("#dataPreview td").click(function () {
                const colIndex = $(this).index();
                const field = keys[colIndex];
                if ($("#xField").val() === "") {
                    $("#xField").val(field);
                } else {
                    $("#yField").val(field);
                }
            });
        },
        error: function (err) {
            console.error(err);
            alert("Bir hata oluştu! Detay: " + (err.responseJSON?.error || "Bilinmeyen hata"));
        }
    });
});

$("#btnDraw").click(function () {
    const chartType = $("#chartType").val();
    const xKey = $("#xField").val();
    const yKey = $("#yField").val();

    if (!xKey || !yKey) {
        alert("X ve Y alanlarını seçmelisiniz!");
        return;
    }

    const labels = fetchedData.map(x => x[xKey]);
    const values = fetchedData.map(x => x[yKey]);

    const canvasId = "chartCanvas" + chartCount;
    $("#chartContainer").append(`<canvas id="${canvasId}" class="chartCanvas" width="400" height="200"></canvas>`);
    const ctx = document.getElementById(canvasId).getContext("2d");

    new Chart(ctx, {
        type: chartType,
        data: {
            labels: labels,
            datasets: [{
                label: `${yKey}`,
                data: values,
                backgroundColor: "rgba(75, 192, 192, 0.5)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true },
                title: {
                    display: true,
                    text: `${xKey} - ${yKey} (${chartType.toUpperCase()})`
                }
            },
            scales: { y: { beginAtZero: true } }
        }
    });

    chartCount++;
});

