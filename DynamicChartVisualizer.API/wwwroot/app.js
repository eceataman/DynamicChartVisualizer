let fetchedData = [];
$("#themeToggle").change(function () {
    if (this.checked) {
        $("body").css({ "background-color": "#212529", "color": "#f8f9fa" });
        $(".container").css("background-color", "#2c2f33");
        $("table").removeClass("table-striped").addClass("table-dark");
    } else {
        $("body").css({ "background-color": "#f4f6f9", "color": "black" });
        $(".container").css("background-color", "white");
        $("table").removeClass("table-dark").addClass("table-striped");
    }
});
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

            const tableHead = keys.map(k => `<th>${k}</th>`).join("");
            const tableRows = data.map(row => {
                return `<tr>${keys.map(k => `<td>${row[k]}</td>`).join("")}</tr>`;
            }).join("");
            $("#dataPreview").html(`<thead><tr>${tableHead}</tr></thead><tbody>${tableRows}</tbody>`);
            $("#tableContainer").show();
            $("#mappingArea").show();

            // Hücreye tıklayarak alan seçimi
            $("#dataPreview td").click(function () {
                const colIndex = $(this).index();
                const field = keys[colIndex];
                if (!$("#xField").val()) {
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
    const chartColor = $("#chartColor").val();

    if (!xKey || !yKey) {
        alert("X ve Y alanlarını seçmelisiniz!");
        return;
    }

    const labels = fetchedData.map(x => x[xKey]);
    const values = fetchedData.map(x => x[yKey]);

    const chartId = `chart_${Date.now()}`;
    $("#chartContainer").append(`
        <div class="mt-4 p-3 border rounded bg-light-subtle">
            <h6>${xKey} - ${yKey} (${chartType.toUpperCase()})</h6>
            <canvas id="${chartId}" height="400"></canvas>
            <button class="btn btn-sm btn-outline-secondary mt-2" onclick="downloadChart('${chartId}')">⬇️ Grafiği İndir</button>
        </div>
    `);

    const ctx = document.getElementById(chartId).getContext("2d");

    new Chart(ctx, {
        type: chartType,
        data: {
            labels: labels,
            datasets: [{
                label: yKey,
                data: values,
                backgroundColor: `${chartColor}80`,
                borderColor: chartColor,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            animation: false,
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
});

function downloadChart(chartId) {
    const link = document.createElement("a");
    link.download = `${chartId}.png`;
    link.href = document.getElementById(chartId).toDataURL("image/png");
    link.click();
}
$("#btnClear").click(function () {
    if (confirm("Tüm grafikleri silmek istediğine emin misin?")) {
        $("#chartContainer").empty();
    }
});
