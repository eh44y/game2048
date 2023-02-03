$(function () {
  const board = $("#board")[0];
  const score = $("#game2048 .score")[0];
  const back = $("#game2048 .back");
  let data = [];
  const history = [];

  back.on("click", () => {
    const prevData = history.pop();
    if (!prevData) {
      return;
    } else {
      score.textContent = prevData.score;
      data = prevData.table;
      drawGame();
    }
  });

  // fragment는 값이 변경되거나 추가 될떄마다 화면에 렌더링 하지 않고 메모리에 저장을 해 효율성을 높일 수 있음.
  // board > fragment > tr > td
  function gameStart() {
    const fragment = document.createDocumentFragment();

    $.each([1, 2, 3, 4], function () {
      const rowData = [];
      data.push(rowData);
      const tr = document.createElement("tr");
      $.each([1, 2, 3, 4], () => {
        rowData.push(0);
        const td = document.createElement("td");
        tr.appendChild(td);
      });
      fragment.appendChild(tr);
    });
    board.appendChild(fragment);

    createRandomCell();
    drawGame();
  } // fn GameStart end

  // $.each에서는 function(index, item), forEach에서는 function(item,index)
  function createRandomCell() {
    const emptyCells = []; // [[i1, ji], [i2, j2]] ...
    $.each(data, function (i, rowData) {
      $.each(rowData, function (j, cellData) {
        if (!cellData) {
          emptyCells.push([i, j]);
        }
      });
    });
    const randomCell =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    data[randomCell[0]][randomCell[1]] = 2;
  } // fn createRandomCell end

  function drawGame() {
    $.each(data, function (i, rowData) {
      $.each(rowData, function (j, cellData) {
        const target = board.children[i].children[j];
        if (cellData > 0) {
          target.textContent = cellData;
          target.className = "color-" + cellData;
        } else {
          target.textContent = "";
          target.className = "";
        }
      });
    });
  } // fn drawGame end

  gameStart();
  // dummy data
  /* data = [
    [32, 2, 4, 2],
    [64, 4, 8, 4],
    [2, 1024, 1024, 32],
    [32, 16, 64, 4],
  ]; */
  drawGame();

  function moveCells(direction) {
    history.push({
      // 깊은 복사 (참조관계 끊어주기)
      table: JSON.parse(JSON.stringify(data)),
      score: score.textContent,
    });

    switch (direction) {
      // csae에 변수가 쓰일경우 {} 로 닫아주어야 함
      case "left": {
        const newData = [[], [], [], []];
        $.each(data, (i, rowData) => {
          $.each(rowData, (j, cellData) => {
            if (cellData) {
              const currentRow = newData[i];
              const prevData = currentRow[currentRow.length - 1];
              if (prevData === cellData) {
                const scoreNum = parseInt(score.textContent);
                score.textContent =
                  scoreNum + currentRow[currentRow.length - 1] * 2;
                currentRow[currentRow.length - 1] *= -2;
              } else {
                newData[i].push(cellData);
              }
            }
          });
        });
        /* console.log(newData); */
        $.each([1, 2, 3, 4], (i, rowData) => {
          $.each([1, 2, 3, 4], (j, cellData) => {
            data[i][j] = Math.abs(newData[i][j]) || 0;
          });
        });
        break;
      }
      case "right": {
        const newData = [[], [], [], []];
        $.each(data, (i, rowData) => {
          $.each(rowData, (j, cellData) => {
            if (rowData[3 - j]) {
              const currentRow = newData[i];
              const prevData = currentRow[currentRow.length - 1];
              if (prevData === rowData[3 - j]) {
                const scoreNum = parseInt(score.textContent);
                score.textContent =
                  scoreNum + currentRow[currentRow.length - 1] * 2;
                currentRow[currentRow.length - 1] *= -2;
              } else {
                newData[i].push(rowData[3 - j]);
              }
            }
          });
        });
        /* console.log(newData); */
        $.each([1, 2, 3, 4], (i, rowData) => {
          $.each([1, 2, 3, 4], (j, cellData) => {
            data[i][3 - j] = Math.abs(newData[i][j]) || 0;
          });
        });
        break;
      }
      case "up": {
        const newData = [[], [], [], []];
        $.each(data, (i, rowData) => {
          $.each(rowData, (j, cellData) => {
            if (cellData) {
              const currentRow = newData[j];
              const prevData = currentRow[currentRow.length - 1];
              if (prevData === cellData) {
                const scoreNum = parseInt(score.textContent);
                score.textContent =
                  scoreNum + currentRow[currentRow.length - 1] * 2;
                currentRow[currentRow.length - 1] *= -2;
              } else {
                newData[j].push(cellData);
              }
            }
          });
        });
        /* console.log(newData); */
        $.each([1, 2, 3, 4], (i, rowData) => {
          $.each([1, 2, 3, 4], (j, cellData) => {
            data[j][i] = Math.abs(newData[i][j]) || 0;
          });
        });
        break;
      }
      case "down": {
        const newData = [[], [], [], []];
        $.each(data, (i, rowData) => {
          $.each(rowData, (j, cellData) => {
            if (data[3 - i][j]) {
              const currentRow = newData[j];
              const prevData = currentRow[currentRow.length - 1];
              if (prevData === data[3 - i][j]) {
                const scoreNum = parseInt(score.textContent);
                score.textContent =
                  scoreNum + currentRow[currentRow.length - 1] * 2;
                currentRow[currentRow.length - 1] *= -2;
              } else {
                newData[j].push(data[3 - i][j]);
              }
            }
          });
        });
        /* console.log(newData); */
        $.each([1, 2, 3, 4], (i, rowData) => {
          $.each([1, 2, 3, 4], (j, cellData) => {
            data[3 - j][i] = Math.abs(newData[i][j]) || 0;
          });
        });
        break;
      }
    }

    if (data.flat().includes(2048)) {
      // 승리
      drawGame();
      setTimeout(() => {
        alert("축하합니다. 2048을 만들었습니다 !");
      }, 0);
    } else if (!data.flat().includes(0)) {
      // 패배
      alert(`패배했습니다 ...${score.textContent}점`);
    } else {
      createRandomCell();
      drawGame();
    }
  } // fn moveCells end

  $(window).on("keyup", (e) => {
    if (e.key === "ArrowUp") {
      moveCells("up");
    } else if (e.key === "ArrowDown") {
      moveCells("down");
    } else if (e.key === "ArrowLeft") {
      moveCells("left");
    } else if (e.key === "ArrowRight") {
      moveCells("right");
    }
  }); // keyup

  let startCoord;
  $("#game2048").on("mousedown", (e) => {
    startCoord = [e.clientX, e.clientY];
  }); // mousedown

  $("#game2048").on("mouseup", (e) => {
    const endCoord = [e.clientX, e.clientY];
    const dirX = endCoord[0] - startCoord[0];
    const dirY = endCoord[1] - startCoord[1];
    if (dirX < 0 && Math.abs(dirX) > Math.abs(dirY)) {
      moveCells("left");
    } else if (dirX > 0 && Math.abs(dirX) > Math.abs(dirY)) {
      moveCells("right");
    } else if (dirY < 0 && Math.abs(dirX) <= Math.abs(dirY)) {
      moveCells("up");
    } else if (dirY > 0 && Math.abs(dirX) <= Math.abs(dirY)) {
      moveCells("down");
    } // mouseup
  });
}); //ready
