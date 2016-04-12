<?xml version="1.0" ?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output encoding="UTF-8" indent="yes" method="html"/>
	<xsl:template match="/">
		<html>
			<head>
				<title>BBS Command Guide</title>
				<link href="style.css" rel="stylesheet" type="text/css"/>
			</head>
			<body>
				<h1>Kingdom Hearts Birth By Sleep Command Tool</h1>
				<h2>Filters</h2>
				<div class="who">
					<ul>
						<li>
							<input name="who" class="char" type="radio" value="All" checked="true">All</input>
						</li>
						<li>
							<input name="who" class="char" type="radio" value="T">Terra</input>
						</li>
						<li>
							<input name="who" class="char" type="radio" value="V">Ventus</input>
						</li>
						<li>
							<input name="who" class="char" type="radio" value="A">Aqua</input>
						</li>
					</ul>
				</div>
				<div class="commandInput">
					<input type="text" name="command"> Command Name</input>
					<div id="meldSuggestions"></div>
				</div>
				<div class="ingredientInput">
					<input type="text" name="ingredient"> Ingredient Name</input>
					<div id="ingredientSuggestions"></div>
				</div>
				<div class="typeSelect">
					<select>
                   </select> Type
                </div>
				<div class="abilitySelect">
					<select>
                	   </select> Ability
                </div>
				<p>
					<button class="reset">Reset</button>
				</p>
				<h2>Commands</h2>
				<table>
					<tr>
						<th rowspan="2">Command</th>
						<th rowspan="2">Type</th>
						<th rowspan="2">Ingredients</th>
						<th rowspan="2">Odds</th>
						<th colspan="10">Abilities</th>
					</tr>
					<tr class="crystal">
						<xsl:for-each select="distinct-values(//ability/@crystal)">
							<th>
								<xsl:value-of select="."/>
							</th>
						</xsl:for-each>
					</tr>
					<xsl:apply-templates select="//command"/>
				</table>
				<script src="bbs5.js" type="text/javascript"/>
			</body>
		</html>
	</xsl:template>
	<xsl:template match="command">
		<tr class="{tokenize(@who,'\s')} type{@class} command">
			<td>
				<xsl:apply-templates/>
			</td>
			<td>
				<xsl:apply-templates select="@class"/>
			</td>
			<td>
				<span class="ingredient">
					<xsl:apply-templates select="@ingredient"/>
				</span>
				<br/>
				<span class="ingredient">
					<xsl:apply-templates select="@ingredient2"/>
				</span>
			</td>
			<td>
				<xsl:apply-templates select="@per"/>
			</td>
			<xsl:apply-templates select="//classes/class[@name = current()/@class]/ability"/>
			<xsl:if test=".[not(@type)]">
				<td colspan="10"></td>
			</xsl:if>
		</tr>
	</xsl:template>
	<xsl:template match="ability">
		<td>
			<xsl:apply-templates/>
		</td>
	</xsl:template>
</xsl:stylesheet>
