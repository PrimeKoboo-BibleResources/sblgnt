const fs = require('fs');
const path = require('path');

// 変換するファイル名のリスト（ダミーのファイル名を含む）
const fileNames = [
  '61-Mt-morphgnt.txt',
  '62-Mk-morphgnt.txt',
  '63-Lk-morphgnt.txt',
  '64-Jn-morphgnt.txt',
  '65-Ac-morphgnt.txt',
  '66-Ro-morphgnt.txt',
  '67-1Co-morphgnt.txt',
  '68-2Co-morphgnt.txt',
  '69-Ga-morphgnt.txt',
  '70-Eph-morphgnt.txt',
  '71-Php-morphgnt.txt',
  '72-Col-morphgnt.txt',
  '73-1Th-morphgnt.txt',
  '74-2Th-morphgnt.txt',
  '75-1Ti-morphgnt.txt',
  '76-2Ti-morphgnt.txt',
  '77-Tit-morphgnt.txt',
  '78-Phm-morphgnt.txt',
  '79-Heb-morphgnt.txt',
  '80-Jas-morphgnt.txt',
  '81-1Pe-morphgnt.txt',
  '82-2Pe-morphgnt.txt',
  '83-1Jn-morphgnt.txt',
  '84-2Jn-morphgnt.txt',
  '85-3Jn-morphgnt.txt',
  '86-Jud-morphgnt.txt',
  '87-Re-morphgnt.txt'
];

/**
 * テキストファイルを加工してCSVファイルに変換する関数
 * @param {string} inputFilePath - 入力ファイルのパス
 */
function convertToCsv(inputFilePath) {
  // 入力ファイル名から出力ファイル名を生成
  const baseName = path.basename(inputFilePath);
  const fileCode = parseInt(baseName.substring(0, 2), 10) - 21;
  const outputFileName = `${String(fileCode).padStart(2, '0')}${baseName.substring(2, baseName.indexOf('.'))}.csv`;
  const outputDirPath = path.join(__dirname, 'csv');
  const outputFilePath = path.join(outputDirPath, outputFileName);

  // 出力ディレクトリが存在しない場合は作成
  if (!fs.existsSync(outputDirPath)) {
    fs.mkdirSync(outputDirPath);
  }

  // ファイルの読み込み
  try {
    const fileContent = fs.readFileSync(inputFilePath, 'utf8');

    // ヘッダー行
    const header = `"book","chapter","verse","part of speech","parsing code","text (including punctuation)","word (with punctuation stripped)","normalized word","lemma"`;

    // 各行を処理してCSV形式に変換
    const csvContent = fileContent.split('\n').map(line => {
      if (line.trim() === '') {
        return '';
      }

      // スペースをカンマに置換
      const parts = line.split(' ');
      // 最初の要素（6桁の数字）を分解
      const numberCode = parts[0];
      const book = `${String(fileCode).padStart(2, '0')}`;
      const chapter = numberCode.substring(2, 4);
      const verse = numberCode.substring(4, 6);

      // 残りの要素を処理
      const remainingParts = parts.slice(1);

      // 各要素の先頭と末尾のハイフンを削除
      const sanitizedParts = remainingParts.map(part => {
        // 正規表現を使用して先頭と末尾のハイフンを削除
        return part.replace(/^[\-]+|[\-]+$/g, '');
      });

      // 全ての要素を結合し、ダブルクォーテーションで囲む
      const newParts = [book, chapter, verse, ...sanitizedParts];
      return `"${newParts.join('","')}"`;

    }).filter(line => line !== '').join('\n'); // 空行を除外

    // ファイルへの書き込み
    fs.writeFileSync(outputFilePath, `${header}\n${csvContent}`, 'utf8');
    console.log(`Successfully converted ${inputFilePath} to ${outputFilePath}`);
  } catch (error) {
    console.error(`Error processing file ${inputFilePath}: ${error.message}`);
  }
}

// ファイル名の配列をループ処理
fileNames.forEach(fileName => {
  // 実際にファイルが存在するかチェック（ダミーファイルの場合はスキップ）
  if (fs.existsSync(fileName)) {
    convertToCsv(fileName);
  } else {
    console.warn(`File not found: ${fileName}. Skipping.`);
  }
});