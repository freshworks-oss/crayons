const fs = require('fs').promises;
const path = require('path');

const generateIconsExportData = async () => {
  const icons_out_dir = './dist/icons';
  const out_dir = './dist';

  const getIconsSVGData = async (svgFile) => {
    try {
      const svgName = path.parse(svgFile).name;
      const svgFilePath = path.join(icons_out_dir, svgFile);
      const svgContent = await fs.readFile(svgFilePath);

      const svg_name =
        svgName.indexOf('-') > -1
          ? svgName.split('-').join('_')
          : svgName === 'new' || svgName === 'delete'
          ? svgName.concat('_icon')
          : svgName;

      const svg_string = svgContent.toString().split('"').join("'");
      const svg_export_data = `export const ${svg_name} = "${svg_string}";`;
      return svg_export_data;
    } catch (ex) {
      console.error(`Error occured while fetching icons : ${ex}`);
      throw ex;
    }
  };
  try {
    let indexData = '';
    const allSvgFiles = await fs.readdir(path.join(icons_out_dir, ''));
    for (const svgFile of allSvgFiles) {
      indexData = indexData + (await getIconsSVGData(svgFile)) + '\n';
    }
    fs.mkdir(out_dir, { recursive: true }).catch(console.error);
    fs.writeFile(path.join(out_dir, 'index.js'), indexData);
    console.log(`Succesfully written @freshworks/crayons-icon/dist/index.js`);
  } catch (ex) {
    console.error(`Error occured while building : ${ex}`);
  }
};

exports.default = generateIconsExportData;
